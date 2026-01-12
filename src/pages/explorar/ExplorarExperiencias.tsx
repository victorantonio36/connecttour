import ExplorarLayout from '@/components/ExplorarLayout';
import { useToast } from '@/hooks/use-toast';
import { useExplorationTracking } from '@/hooks/useExplorationTracking';
import { useEffect } from 'react';

const mockExperiencias = [
  {
    id: '1',
    name: 'Muamba de Galinha Experience',
    description: 'Aprenda a preparar o prato tradicional angolano com chefs locais em Luanda.',
    rating: 4.9,
    certified: true,
    province: 'Luanda',
    services: ['Aula de Culinária', 'Degustação', 'Receitas']
  },
  {
    id: '2',
    name: 'Dança Semba & Kizomba',
    description: 'Aulas de dança tradicional angolana com instrutores profissionais.',
    rating: 4.8,
    certified: true,
    province: 'Luanda',
    services: ['Aulas de Dança', 'Música ao Vivo', 'Certificado']
  },
  {
    id: '3',
    name: 'Café de Angola Tour',
    description: 'Visite plantações de café no Uíge e aprenda sobre o café angolano de alta qualidade.',
    rating: 4.7,
    certified: true,
    province: 'Uíge',
    services: ['Tour de Plantação', 'Degustação', 'Compra Direta']
  },
  {
    id: '4',
    name: 'Artesanato Kongo',
    description: 'Workshop de artesanato tradicional com artesãos da cultura Kongo.',
    rating: 4.6,
    certified: false,
    province: 'Uíge',
    services: ['Workshop', 'Materiais Incluídos', 'Peça para Levar']
  },
  {
    id: '5',
    name: 'Pesca Tradicional Namibe',
    description: 'Experiência de pesca artesanal com pescadores locais na costa do Namibe.',
    rating: 4.5,
    certified: true,
    province: 'Namibe',
    services: ['Pesca', 'Almoço de Peixe Fresco', 'Passeio de Barco']
  },
  {
    id: '6',
    name: 'Safari Fotográfico Kissama',
    description: 'Capture os melhores momentos da vida selvagem com guias fotógrafos profissionais.',
    rating: 4.9,
    certified: true,
    province: 'Cuanza Sul',
    services: ['Safari', 'Dicas de Fotografia', 'Transporte 4x4']
  }
];

const ExplorarExperiencias = () => {
  const { toast } = useToast();
  const { trackExploration } = useExplorationTracking();

  useEffect(() => {
    trackExploration({
      category: 'experiencias',
      eventType: 'page_view'
    });
  }, [trackExploration]);

  const handlePartnerClick = (partner: { name: string }) => {
    toast({
      title: 'Ver Experiência Completa',
      description: `Detalhes completos de "${partner.name}" estarão disponíveis em breve. Esta é uma demonstração.`,
    });
  };

  return (
    <ExplorarLayout
      title={{
        pt: 'Experiências Culturais e Gastronómicas',
        en: 'Cultural & Gastronomic Experiences'
      }}
      subtitle={{
        pt: 'Sabores autênticos e vivências culturais que revelam a alma angolana',
        en: "Authentic flavors and cultural experiences revealing Angola's soul"
      }}
      category="experiencias"
      partners={mockExperiencias}
      actionLabel={{
        pt: 'Ver Experiência Completa',
        en: 'View Full Experience'
      }}
      onPartnerClick={handlePartnerClick}
    />
  );
};

export default ExplorarExperiencias;
