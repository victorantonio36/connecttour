import ExplorarLayout from '@/components/ExplorarLayout';
import { useToast } from '@/hooks/use-toast';
import { useExplorationTracking } from '@/hooks/useExplorationTracking';
import { useEffect } from 'react';

const mockHoteis = [
  {
    id: '1',
    name: 'Epic Sana Luanda Hotel',
    description: 'Hotel 5 estrelas com vista para a Baía de Luanda. Spa, restaurantes gourmet e business center.',
    rating: 4.9,
    certified: true,
    province: 'Luanda',
    services: ['Spa', 'Restaurante', 'Piscina', 'Business Center']
  },
  {
    id: '2',
    name: 'Serra da Leba Lodge',
    description: 'Lodge de montanha com vistas espetaculares da Serra da Leba e clima ameno.',
    rating: 4.8,
    certified: true,
    province: 'Huíla',
    services: ['Restaurante', 'Tours', 'Wi-Fi']
  },
  {
    id: '3',
    name: 'Namibe Desert Camp',
    description: 'Acampamento de luxo no coração do deserto do Namibe. Experiência única sob as estrelas.',
    rating: 4.7,
    certified: true,
    province: 'Namibe',
    services: ['Glamping', 'Safari', 'Refeições Incluídas']
  },
  {
    id: '4',
    name: 'Kalandula Falls Hotel',
    description: 'O hotel mais próximo das majestosas Quedas de Kalandula. Conforto e natureza.',
    rating: 4.6,
    certified: false,
    province: 'Malanje',
    services: ['Restaurante', 'Transfers', 'Guias Locais']
  },
  {
    id: '5',
    name: 'Lobito Bay Resort',
    description: 'Resort à beira-mar com praias privadas e atividades aquáticas.',
    rating: 4.5,
    certified: true,
    province: 'Benguela',
    services: ['Praia', 'Piscina', 'Desportos Aquáticos']
  },
  {
    id: '6',
    name: 'Kissama Safari Lodge',
    description: 'Lodge dentro do Parque Nacional da Kissama. Safaris incluídos no pacote.',
    rating: 4.8,
    certified: true,
    province: 'Cuanza Sul',
    services: ['Safari', 'Pensão Completa', 'Observação de Animais']
  }
];

const ExplorarHospedagem = () => {
  const { toast } = useToast();
  const { trackExploration } = useExplorationTracking();

  useEffect(() => {
    trackExploration({
      category: 'hospedagem',
      eventType: 'page_view'
    });
  }, [trackExploration]);

  const handlePartnerClick = (partner: { name: string }) => {
    toast({
      title: 'Reserva Oficial',
      description: `Em breve você será redirecionado para o site oficial de ${partner.name}. Esta é uma demonstração.`,
    });
  };

  return (
    <ExplorarLayout
      title={{
        pt: 'Hotéis e Hospedagem',
        en: 'Hotels & Accommodation'
      }}
      subtitle={{
        pt: 'Acomodações verificadas em toda Angola, desde hotéis de luxo a lodges de natureza',
        en: 'Verified accommodations across Angola, from luxury hotels to nature lodges'
      }}
      category="hospedagem"
      partners={mockHoteis}
      actionLabel={{
        pt: 'Ir para Reserva Oficial',
        en: 'Go to Official Booking'
      }}
      onPartnerClick={handlePartnerClick}
    />
  );
};

export default ExplorarHospedagem;
