import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Service {
  id: string;
  name_pt: string;
  name_en: string;
  description_pt: string;
  description_en: string;
  price: number;
  currency: string;
  price_unit: string;
  active: boolean;
  company_id: string;
  company_name?: string;
}

interface Partner {
  id: string;
  name: string;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name_pt: '',
    name_en: '',
    description_pt: '',
    description_en: '',
    price: 0,
    currency: 'USD',
    price_unit: 'per person',
    company_id: '',
    features: {}
  });
  const { logAdminAction } = useAdmin();
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      const { data: servicesData, error: servicesError } = await supabase
        .from('partner_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;

      const { data: partnersData, error: partnersError } = await supabase
        .from('partner_companies')
        .select('id, name');

      if (partnersError) throw partnersError;

      setPartners(partnersData || []);

      const servicesWithCompany = (servicesData || []).map(service => ({
        ...service,
        company_name: partnersData?.find(p => p.id === service.company_id)?.name || 'Desconhecido'
      }));

      setServices(servicesWithCompany);
      setFilteredServices(servicesWithCompany);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredServices(services.filter(s =>
        s.name_pt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, services]);

  const handleToggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('partner_services')
        .update({ active: !service.active })
        .eq('id', service.id);

      if (error) throw error;

      await logAdminAction('update', 'partner_service', service.id, { active: service.active } as Record<string, unknown>, { active: !service.active } as Record<string, unknown>, `${service.active ? 'Desativado' : 'Ativado'}: ${service.name_pt}`);
      toast({ title: 'Sucesso', description: `Serviço ${service.active ? 'desativado' : 'ativado'}.` });
      fetchServices();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar serviço.', variant: 'destructive' });
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Tem certeza que deseja excluir ${service.name_pt}?`)) return;

    try {
      const { error } = await supabase
        .from('partner_services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      await logAdminAction('delete', 'partner_service', service.id, service as unknown as Record<string, unknown>, null, `Excluído: ${service.name_pt}`);
      toast({ title: 'Sucesso', description: 'Serviço excluído.' });
      fetchServices();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir serviço.', variant: 'destructive' });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;

    try {
      const { error } = await supabase
        .from('partner_services')
        .update({
          name_pt: editingService.name_pt,
          name_en: editingService.name_en,
          description_pt: editingService.description_pt,
          description_en: editingService.description_en,
          price: editingService.price,
          currency: editingService.currency,
          price_unit: editingService.price_unit
        })
        .eq('id', editingService.id);

      if (error) throw error;

      await logAdminAction('update', 'partner_service', editingService.id, null, editingService as unknown as Record<string, unknown>, `Editado: ${editingService.name_pt}`);
      toast({ title: 'Sucesso', description: 'Serviço atualizado.' });
      setIsEditDialogOpen(false);
      fetchServices();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar serviço.', variant: 'destructive' });
    }
  };

  const handleAddService = async () => {
    if (!newService.company_id || !newService.name_pt) {
      toast({ title: 'Erro', description: 'Preencha os campos obrigatórios.', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase
        .from('partner_services')
        .insert({
          ...newService,
          active: true
        });

      if (error) throw error;

      await logAdminAction('create', 'partner_service', undefined, null, newService, `Criado: ${newService.name_pt}`);
      toast({ title: 'Sucesso', description: 'Serviço criado.' });
      setIsAddDialogOpen(false);
      setNewService({ name_pt: '', name_en: '', description_pt: '', description_en: '', price: 0, currency: 'USD', price_unit: 'per person', company_id: '', features: {} });
      fetchServices();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao criar serviço.', variant: 'destructive' });
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestão de Serviços</CardTitle>
            <CardDescription>Gerencie todos os serviços da plataforma</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Serviço
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum serviço encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{service.name_pt}</p>
                          <p className="text-sm text-muted-foreground">{service.name_en}</p>
                        </div>
                      </TableCell>
                      <TableCell>{service.company_name}</TableCell>
                      <TableCell>
                        <span className="font-medium">{service.currency} {service.price}</span>
                        <span className="text-sm text-muted-foreground"> / {service.price_unit}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.active}
                            onCheckedChange={() => handleToggleActive(service)}
                          />
                          <Badge variant={service.active ? 'default' : 'secondary'}>
                            {service.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(service)}>
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
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>Atualize as informações do serviço</DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome (PT)</Label>
                  <Input
                    value={editingService.name_pt}
                    onChange={(e) => setEditingService({ ...editingService, name_pt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome (EN)</Label>
                  <Input
                    value={editingService.name_en}
                    onChange={(e) => setEditingService({ ...editingService, name_en: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Preço</Label>
                  <Input
                    type="number"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Input
                    value={editingService.currency}
                    onChange={(e) => setEditingService({ ...editingService, currency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Input
                    value={editingService.price_unit}
                    onChange={(e) => setEditingService({ ...editingService, price_unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição (PT)</Label>
                <Textarea
                  value={editingService.description_pt}
                  onChange={(e) => setEditingService({ ...editingService, description_pt: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição (EN)</Label>
                <Textarea
                  value={editingService.description_en}
                  onChange={(e) => setEditingService({ ...editingService, description_en: e.target.value })}
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

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
            <DialogDescription>Crie um novo serviço para um parceiro</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Empresa Parceira *</Label>
              <Select value={newService.company_id} onValueChange={(value) => setNewService({ ...newService, company_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map(partner => (
                    <SelectItem key={partner.id} value={partner.id}>{partner.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome (PT) *</Label>
                <Input
                  value={newService.name_pt}
                  onChange={(e) => setNewService({ ...newService, name_pt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nome (EN)</Label>
                <Input
                  value={newService.name_en}
                  onChange={(e) => setNewService({ ...newService, name_en: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Preço</Label>
                <Input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Input
                  value={newService.currency}
                  onChange={(e) => setNewService({ ...newService, currency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade</Label>
                <Input
                  value={newService.price_unit}
                  onChange={(e) => setNewService({ ...newService, price_unit: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição (PT)</Label>
              <Textarea
                value={newService.description_pt}
                onChange={(e) => setNewService({ ...newService, description_pt: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (EN)</Label>
              <Textarea
                value={newService.description_en}
                onChange={(e) => setNewService({ ...newService, description_en: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddService}>Criar Serviço</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
