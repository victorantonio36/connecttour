import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, CheckCircle, XCircle, Award } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  legal_name: string;
  category: string;
  email: string;
  phone: string;
  provinces: string[];
  approved: boolean;
  certified: boolean;
  subscription_status: string;
  created_at: string;
  description_pt: string;
  description_en: string;
}

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { logAdminAction } = useAdmin();
  const { toast } = useToast();

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
      setFilteredPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    let filtered = partners;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter(p => p.approved);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(p => !p.approved);
      } else if (statusFilter === 'certified') {
        filtered = filtered.filter(p => p.certified);
      }
    }

    setFilteredPartners(filtered);
  }, [searchTerm, statusFilter, partners]);

  const handleApprove = async (partner: Partner) => {
    try {
      const { error } = await supabase
        .from('partner_companies')
        .update({ approved: true, subscription_status: 'active' })
        .eq('id', partner.id);

      if (error) throw error;

      await logAdminAction('approve', 'partner_company', partner.id, { approved: false } as Record<string, unknown>, { approved: true } as Record<string, unknown>, `Aprovado: ${partner.name}`);
      toast({ title: 'Sucesso', description: 'Parceiro aprovado.' });
      fetchPartners();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao aprovar parceiro.', variant: 'destructive' });
    }
  };

  const handleCertify = async (partner: Partner) => {
    try {
      const newCertified = !partner.certified;
      const { error } = await supabase
        .from('partner_companies')
        .update({ certified: newCertified })
        .eq('id', partner.id);

      if (error) throw error;

      await logAdminAction('update', 'partner_company', partner.id, { certified: partner.certified } as Record<string, unknown>, { certified: newCertified } as Record<string, unknown>, `Certificação ${newCertified ? 'concedida' : 'removida'}: ${partner.name}`);
      toast({ title: 'Sucesso', description: `Certificação ${newCertified ? 'concedida' : 'removida'}.` });
      fetchPartners();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar certificação.', variant: 'destructive' });
    }
  };

  const handleDelete = async (partner: Partner) => {
    if (!confirm(`Tem certeza que deseja excluir ${partner.name}?`)) return;

    try {
      const { error } = await supabase
        .from('partner_companies')
        .delete()
        .eq('id', partner.id);

      if (error) throw error;

      await logAdminAction('delete', 'partner_company', partner.id, partner as unknown as Record<string, unknown>, null, `Excluído: ${partner.name}`);
      toast({ title: 'Sucesso', description: 'Parceiro excluído.' });
      fetchPartners();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir parceiro.', variant: 'destructive' });
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPartner) return;

    try {
      const { error } = await supabase
        .from('partner_companies')
        .update({
          name: editingPartner.name,
          email: editingPartner.email,
          phone: editingPartner.phone,
          description_pt: editingPartner.description_pt,
          description_en: editingPartner.description_en
        })
        .eq('id', editingPartner.id);

      if (error) throw error;

      await logAdminAction('update', 'partner_company', editingPartner.id, null, editingPartner as unknown as Record<string, unknown>, `Editado: ${editingPartner.name}`);
      toast({ title: 'Sucesso', description: 'Parceiro atualizado.' });
      setIsEditDialogOpen(false);
      fetchPartners();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar parceiro.', variant: 'destructive' });
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
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Parceiros</CardTitle>
          <CardDescription>Gerencie todas as empresas parceiras da plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="certified">Certificados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum parceiro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{partner.name}</p>
                          <p className="text-sm text-muted-foreground">{partner.legal_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{partner.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{partner.email}</p>
                          <p className="text-muted-foreground">{partner.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {partner.approved ? (
                            <Badge className="bg-green-500">Aprovado</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-500 border-amber-500">Pendente</Badge>
                          )}
                          {partner.certified && (
                            <Badge className="bg-blue-500">Certificado</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!partner.approved && (
                            <Button size="sm" variant="ghost" onClick={() => handleApprove(partner)}>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleCertify(partner)}>
                            <Award className={`h-4 w-4 ${partner.certified ? 'text-blue-500' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(partner)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(partner)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Parceiro</DialogTitle>
            <DialogDescription>Atualize as informações do parceiro</DialogDescription>
          </DialogHeader>
          {editingPartner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input
                    value={editingPartner.name}
                    onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editingPartner.email}
                    onChange={(e) => setEditingPartner({ ...editingPartner, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={editingPartner.phone}
                  onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (PT)</Label>
                <Textarea
                  value={editingPartner.description_pt}
                  onChange={(e) => setEditingPartner({ ...editingPartner, description_pt: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (EN)</Label>
                <Textarea
                  value={editingPartner.description_en}
                  onChange={(e) => setEditingPartner({ ...editingPartner, description_en: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartners;
