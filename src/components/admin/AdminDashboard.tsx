import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Calendar, DollarSign, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalPartners: number;
  pendingPartners: number;
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
}

interface PendingPartner {
  id: string;
  name: string;
  category: string;
  email: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPartners: 0,
    pendingPartners: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [pendingPartners, setPendingPartners] = useState<PendingPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const { logAdminAction } = useAdmin();
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      // Fetch partner stats
      const { data: partners } = await supabase
        .from('partner_companies')
        .select('id, approved');
      
      const totalPartners = partners?.length || 0;
      const pendingCount = partners?.filter(p => !p.approved).length || 0;

      // Fetch pending partners for approval list
      const { data: pending } = await supabase
        .from('partner_companies')
        .select('id, name, category, email, created_at')
        .eq('approved', false)
        .order('created_at', { ascending: false })
        .limit(5);

      setPendingPartners(pending || []);

      // Fetch booking stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, total_amount');
      
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) || 0;

      // Fetch user stats
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id');
      
      const totalUsers = profiles?.length || 0;

      setStats({
        totalPartners,
        pendingPartners: pendingCount,
        totalBookings,
        totalRevenue,
        totalUsers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprovePartner = async (partnerId: string, partnerName: string) => {
    try {
      const { error } = await supabase
        .from('partner_companies')
        .update({ approved: true, subscription_status: 'active' })
        .eq('id', partnerId);

      if (error) throw error;

      await logAdminAction('approve', 'partner_company', partnerId, null, { approved: true }, `Aprovado parceiro: ${partnerName}`);
      
      toast({ title: 'Parceiro aprovado', description: `${partnerName} foi aprovado com sucesso.` });
      fetchStats();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível aprovar o parceiro.', variant: 'destructive' });
    }
  };

  const handleRejectPartner = async (partnerId: string, partnerName: string) => {
    try {
      const { error } = await supabase
        .from('partner_companies')
        .delete()
        .eq('id', partnerId);

      if (error) throw error;

      await logAdminAction('reject', 'partner_company', partnerId, null, null, `Rejeitado parceiro: ${partnerName}`);
      
      toast({ title: 'Parceiro rejeitado', description: `${partnerName} foi removido.` });
      fetchStats();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível rejeitar o parceiro.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parceiros</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPartners}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingPartners} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Em reservas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.pendingPartners}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Aprovações Pendentes</CardTitle>
          <CardDescription>Empresas parceiras aguardando validação</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPartners.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma aprovação pendente</p>
          ) : (
            <div className="space-y-4">
              {pendingPartners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{partner.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{partner.category}</Badge>
                      <span className="text-sm text-muted-foreground">{partner.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cadastrado em {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleApprovePartner(partner.id, partner.name)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleRejectPartner(partner.id, partner.name)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
