import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

interface PaymentSettings {
  default_currency: string;
  exchange_rates: {
    USD_TO_KZ: number;
    USD_TO_EUR: number;
  };
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  email: 'angolaconecttour@gmail.com',
  phone: '+244 923 456 789',
  whatsapp: '+244923456789',
  instagram: '@angolaconnectour',
  facebook: 'AngolaConnecTour',
  twitter: '@connectour_ao'
};

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  default_currency: 'USD',
  exchange_rates: {
    USD_TO_KZ: 850,
    USD_TO_EUR: 0.92
  }
};

export const usePlatformSettings = () => {
  const { data: contactInfo, isLoading: contactLoading, refetch: refetchContact } = useQuery({
    queryKey: ['platform-settings', 'contact_info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single();
      
      if (error || !data) {
        return DEFAULT_CONTACT_INFO;
      }
      
      return data.value as unknown as ContactInfo;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const { data: paymentSettings, isLoading: paymentLoading } = useQuery({
    queryKey: ['platform-settings', 'payment_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'payment_settings')
        .single();
      
      if (error || !data) {
        return DEFAULT_PAYMENT_SETTINGS;
      }
      
      return data.value as unknown as PaymentSettings;
    },
    staleTime: 5 * 60 * 1000
  });

  const updateContactInfo = async (newInfo: Partial<ContactInfo>) => {
    const currentInfo = contactInfo || DEFAULT_CONTACT_INFO;
    const updatedInfo = { ...currentInfo, ...newInfo };
    
    const { error } = await supabase
      .from('platform_settings')
      .upsert({
        key: 'contact_info',
        value: updatedInfo,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });
    
    if (error) throw error;
    
    await refetchContact();
    return updatedInfo;
  };

  return {
    contactInfo: contactInfo || DEFAULT_CONTACT_INFO,
    paymentSettings: paymentSettings || DEFAULT_PAYMENT_SETTINGS,
    isLoading: contactLoading || paymentLoading,
    updateContactInfo
  };
};
