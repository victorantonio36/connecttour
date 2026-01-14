import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  Users, 
  Calendar, 
  Image, 
  FileText,
  LogOut,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminPartners from '@/components/admin/AdminPartners';
import AdminServices from '@/components/admin/AdminServices';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminBookings from '@/components/admin/AdminBookings';
import AdminMedia from '@/components/admin/AdminMedia';
import AdminAuditLogs from '@/components/admin/AdminAuditLogs';
import AdminContacts from '@/components/admin/AdminContacts';

const Admin = () => {
  const { isAdmin, isLoading, user } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Enable inactivity logout (15 minutes)
  useInactivityLogout({ enabled: isAdmin });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Sessão encerrada', description: 'Até logo!' });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with brand colors */}
      <header className="bg-primary border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Painel Administrativo</h1>
              <p className="text-sm text-primary-foreground/70">Angola ConnecTour</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/80">{user?.email}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-8 w-full max-w-5xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Parceiros</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Mídia</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contatos</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          <TabsContent value="partners">
            <AdminPartners />
          </TabsContent>
          <TabsContent value="services">
            <AdminServices />
          </TabsContent>
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>
          <TabsContent value="media">
            <AdminMedia />
          </TabsContent>
          <TabsContent value="contacts">
            <AdminContacts />
          </TabsContent>
          <TabsContent value="logs">
            <AdminAuditLogs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
