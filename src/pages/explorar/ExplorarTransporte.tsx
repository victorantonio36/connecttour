import ExplorarLayout from '@/components/ExplorarLayout';
import { useToast } from '@/hooks/use-toast';
import { useExplorationTracking } from '@/hooks/useExplorationTracking';
import { useEffect } from 'react';

const mockTransportes = [
  {
    id: '1',
    name: 'Angola Premium Transfers',
    description: 'Transfers VIP do aeroporto para hotéis em Luanda com veículos de luxo.',
    rating: 4.9,
    certified: true,
    province: 'Luanda',
    services: ['Aeroporto-Hotel', 'Wi-Fi', 'Água Mineral']
  },
  {
    id: '2',
    name: 'Safari 4x4 Rentals',
    description: 'Aluguer de veículos 4x4 preparados para expedições e safaris.',
    rating: 4.8,
    certified: true,
    province: 'Luanda',
    services: ['Toyota Land Cruiser', 'GPS', 'Equipamento Safari']
  },
  {
    id: '3',
    name: 'Kalandula Express',
    description: 'Transporte direto Luanda-Malanje com paragem nas Quedas de Kalandula.',
    rating: 4.7,
    certified: true,
    province: 'Malanje',
    services: ['Rota Luanda-Malanje', 'Ar Condicionado', 'Guia']
  },
  {
    id: '4',
    name: 'Namibe Desert Drivers',
    description: 'Motoristas experientes para expedições no deserto do Namibe.',
    rating: 4.6,
    certified: false,
    province: 'Namibe',
    services: ['Expedições', 'Conhecimento Local', 'Veículo 4x4']
  },
  {
    id: '5',
    name: 'Lobito-Benguela Shuttle',
    description: 'Serviço de shuttle regular entre Lobito, Benguela e praias da região.',
    rating: 4.5,
    certified: true,
    province: 'Benguela',
    services: ['Shuttle Regular', 'Rotas Turísticas', 'Reserva Online']
  },
  {
    id: '6',
    name: 'Huíla Mountain Transfers',
    description: 'Transporte especializado para a Serra da Leba e Tundavala.',
    rating: 4.7,
    certified: true,
    province: 'Huíla',
    services: ['Serra da Leba', 'Tundavala', 'Tours Personalizados']
  }
];

const ExplorarTransporte = () => {
  const { toast } = useToast();
  const { trackExploration } = useExplorationTracking();

  useEffect(() => {
    trackExploration({
      category: 'transporte',
      eventType: 'page_view'
    });
  }, [trackExploration]);

  const handlePartnerClick = (partner: { name: string }) => {
    toast({
      title: 'Agendar via Parceiro',
      description: `Em breve você poderá agendar diretamente com ${partner.name}. Esta é uma demonstração.`,
    });
  };

  return (
    <ExplorarLayout
      title={{
        pt: 'Táxis e Transfers',
        en: 'Taxis & Transfers'
      }}
      subtitle={{
        pt: 'Transporte seguro e confiável para suas viagens por Angola',
        en: 'Safe and reliable transportation for your travels across Angola'
      }}
      category="transporte"
      partners={mockTransportes}
      actionLabel={{
        pt: 'Agendar via Parceiro',
        en: 'Schedule via Partner'
      }}
      onPartnerClick={handlePartnerClick}
    />
  );
};

export default ExplorarTransporte;
