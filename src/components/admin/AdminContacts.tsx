import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, MessageCircle, MapPin, Save, Loader2 } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

const AdminContacts = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    whatsapp: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single();

      if (error) throw error;

      if (data?.value) {
        const value = data.value as Record<string, string>;
        setContactInfo({
          email: value.email || '',
          phone: value.phone || '',
          whatsapp: value.whatsapp || '',
          address: value.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // First check if the record exists
      const { data: existing } = await supabase
        .from('platform_settings')
        .select('id')
        .eq('key', 'contact_info')
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('platform_settings')
          .update({
            value: contactInfo as unknown as Json,
            updated_at: new Date().toISOString()
          })
          .eq('key', 'contact_info');

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('platform_settings')
          .insert([{
            key: 'contact_info',
            value: contactInfo as unknown as Json
          }]);

        if (error) throw error;
      }

      toast({
        title: 'Contatos atualizados',
        description: 'As informações de contato foram salvas com sucesso.'
      });
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as informações de contato.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Informações de Contato
          </CardTitle>
          <CardDescription>
            Gerencie as informações de contato exibidas no site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="angolaconecttour@gmail.com"
              className="max-w-md"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="939319554"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Apenas números, sem código do país
            </p>
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              value={contactInfo.whatsapp}
              onChange={(e) => setContactInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="244939319554"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Formato internacional: código do país + número (ex: 244939319554)
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Endereço
            </Label>
            <Input
              id="address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Luanda, Angola"
              className="max-w-md"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContacts;
