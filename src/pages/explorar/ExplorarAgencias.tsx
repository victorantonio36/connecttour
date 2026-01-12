import ExplorarLayout from '@/components/ExplorarLayout';
import { useToast } from '@/hooks/use-toast';
import { useExplorationTracking } from '@/hooks/useExplorationTracking';
import { useEffect } from 'react';

const mockAgencias = [
  {
    id: '1',
    name: 'Safari Angola Tours',
    description: 'Especialistas em safaris na Kissama e expedições ao deserto do Namibe. Mais de 10 anos de experiência.',
    rating: 4.9,
    certified: true,
    province: 'Luanda',
    services: ['Safaris', 'Expedições', 'Tours Privados']
  },
  {
    id: '2',
    name: 'Kalandula Adventures',
    description: 'Tours guiados às Quedas de Kalandula e Pedras Negras de Pungo Andongo.',
    rating: 4.8,
    certified: true,
    province: 'Malanje',
    services: ['Tours de Natureza', 'Fotografia', 'Aventura']
  },
  {
    id: '3',
    name: 'Namibe Expeditions',
    description: 'Experiências únicas no deserto do Namibe e Parque Nacional da Iona.',
    rating: 4.7,
    certified: true,
    province: 'Namibe',
    services: ['Expedições', 'Camping', 'Observação de Fauna']
  },
  {
    id: '4',
    name: 'Leba Mountain Tours',
    description: 'Tours especializados na Serra da Leba e Fenda da Tundavala com guias locais.',
    rating: 4.6,
    certified: false,
    province: 'Huíla',
    services: ['Montanhismo', 'Tours Culturais']
  },
  {
    id: '5',
    name: 'Benguela Beach Tours',
    description: 'Explore as melhores praias de Benguela com roteiros exclusivos.',
    rating: 4.5,
    certified: true,
    province: 'Benguela',
    services: ['Tours de Praia', 'Mergulho', 'Pesca']
  },
  {
    id: '6',
    name: 'Kongo Heritage Tours',
    description: 'Descubra as Grutas do Nzenzo e a rica cultura Kongo do norte de Angola.',
    rating: 4.8,
    certified: true,
    province: 'Uíge',
    services: ['Tours Culturais', 'Património', 'Espeleologia']
  }
];

const ExplorarAgencias = () => {
  const { toast } = useToast();
  const { trackExploration } = useExplorationTracking();

  useEffect(() => {
    trackExploration({
      category: 'agencias',
      eventType: 'page_view'
    });
  }, [trackExploration]);

  const handlePartnerClick = (partner: { name: string }) => {
    toast({
      title: 'Reserva via Parceiro',
      description: `Em breve você será redirecionado para ${partner.name}. Esta é uma demonstração.`,
    });
  };

  return (
    <ExplorarLayout
      title={{
        pt: 'Agências de Turismo Certificadas',
        en: 'Certified Tourism Agencies'
      }}
      subtitle={{
        pt: 'Operadores verificados que organizam roteiros personalizados e experiências guiadas por toda Angola',
        en: 'Verified operators organizing custom itineraries and guided experiences throughout Angola'
      }}
      category="agencias"
      partners={mockAgencias}
      actionLabel={{
        pt: 'Reservar via Parceiro',
        en: 'Book via Partner'
      }}
      onPartnerClick={handlePartnerClick}
    />
  );
};

export default ExplorarAgencias;
