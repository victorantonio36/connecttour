import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, ShieldOff, UserCog } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  roles: string[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { logAdminAction } = useAdmin();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        roles: (roles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role)
      }));

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.roles.includes(roleFilter));
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleAssignRole = async (userId: string, role: string, userName: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      await logAdminAction('assign_role', 'user_role', userId, null, { role }, `Atribuído role ${role} para ${userName}`);
      toast({ title: 'Sucesso', description: `Role ${role} atribuída.` });
      fetchUsers();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({ title: 'Aviso', description: 'Usuário já possui esta role.', variant: 'destructive' });
      } else {
        toast({ title: 'Erro', description: 'Falha ao atribuir role.', variant: 'destructive' });
      }
    }
  };

  const handleRevokeRole = async (userId: string, role: string, userName: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      await logAdminAction('revoke_role', 'user_role', userId, { role }, null, `Revogada role ${role} de ${userName}`);
      toast({ title: 'Sucesso', description: `Role ${role} revogada.` });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao revogar role.', variant: 'destructive' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'partner': return 'bg-blue-500';
      case 'moderator': return 'bg-purple-500';
      default: return 'bg-gray-500';
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
          <CardTitle>Gestão de Usuários</CardTitle>
          <CardDescription>Gerencie usuários e suas permissões</CardDescription>
        </CardHeader>
        <CardContent>
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
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="partner">Parceiros</SelectItem>
                <SelectItem value="moderator">Moderadores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.full_name || 'Sem nome'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.phone || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length === 0 ? (
                            <Badge variant="secondary">Usuário</Badge>
                          ) : (
                            user.roles.map(role => (
                              <Badge key={role} className={getRoleBadgeColor(role)}>
                                {role}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!user.roles.includes('partner') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAssignRole(user.id, 'partner', user.full_name)}
                              title="Tornar Parceiro"
                            >
                              <UserCog className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          {!user.roles.includes('moderator') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAssignRole(user.id, 'moderator', user.full_name)}
                              title="Tornar Moderador"
                            >
                              <Shield className="h-4 w-4 text-purple-500" />
                            </Button>
                          )}
                          {user.roles.includes('partner') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRevokeRole(user.id, 'partner', user.full_name)}
                              title="Remover Parceiro"
                            >
                              <ShieldOff className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                          {user.roles.includes('moderator') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRevokeRole(user.id, 'moderator', user.full_name)}
                              title="Remover Moderador"
                            >
                              <ShieldOff className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
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
    </div>
  );
};

export default AdminUsers;
