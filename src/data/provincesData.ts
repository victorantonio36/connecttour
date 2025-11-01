export interface Province {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: {
    pt: string;
    en: string;
  };
  highlights: {
    pt: string[];
    en: string[];
  };
  touristHeat: {
    level: 'low' | 'medium' | 'high' | 'very-high';
    score: number;
    trend: 'stable' | 'rising' | 'falling';
    monthlyVisitors: number;
    growthRate: number;
  };
  popularityRank: number;
  certifiedPartners: number;
  averageRating: number;
}

export const featuredProvinces: Province[] = [
  {
    id: '1',
    name: 'Namibe',
    slug: 'namibe',
    image: '/assets/provinces/namibe-desert.webp',
    description: {
      pt: 'Deserto do Namibe e Parque Nacional da Iona, paisagens surreais únicas em África',
      en: 'Namibe Desert and Iona National Park, surreal landscapes unique in Africa'
    },
    highlights: {
      pt: ['Deserto do Namibe', 'Parque da Iona', 'Costa Atlântica', 'Welwitschia Mirabilis'],
      en: ['Namibe Desert', 'Iona Park', 'Atlantic Coast', 'Welwitschia Mirabilis']
    },
    touristHeat: {
      level: 'very-high',
      score: 92,
      trend: 'rising',
      monthlyVisitors: 3800,
      growthRate: 18.5
    },
    popularityRank: 1,
    certifiedPartners: 8,
    averageRating: 4.9
  },
  {
    id: '2',
    name: 'Malanje',
    slug: 'malanje',
    image: '/assets/provinces/malanje-quedas.webp',
    description: {
      pt: 'Majestosas Quedas de Kalandula, segundas maiores cataratas de África',
      en: 'Majestic Kalandula Falls, second largest waterfalls in Africa'
    },
    highlights: {
      pt: ['Quedas de Kalandula', 'Pedras Negras de Pungo Andongo', 'Cultura Kimbundu'],
      en: ['Kalandula Falls', 'Black Rocks of Pungo Andongo', 'Kimbundu Culture']
    },
    touristHeat: {
      level: 'very-high',
      score: 88,
      trend: 'rising',
      monthlyVisitors: 3200,
      growthRate: 15.2
    },
    popularityRank: 2,
    certifiedPartners: 7,
    averageRating: 4.8
  },
  {
    id: '3',
    name: 'Luanda',
    slug: 'luanda',
    image: '/assets/provinces/luanda.webp',
    description: {
      pt: 'Capital cosmopolita com modernidade, história colonial e baía deslumbrante',
      en: 'Cosmopolitan capital with modernity, colonial history and stunning bay'
    },
    highlights: {
      pt: ['Fortaleza de São Miguel', 'Ilha de Luanda', 'Marginal de Luanda', 'Museu da Escravatura'],
      en: ['São Miguel Fortress', 'Luanda Island', 'Luanda Waterfront', 'Slavery Museum']
    },
    touristHeat: {
      level: 'high',
      score: 82,
      trend: 'stable',
      monthlyVisitors: 5500,
      growthRate: 3.2
    },
    popularityRank: 3,
    certifiedPartners: 15,
    averageRating: 4.6
  },
  {
    id: '4',
    name: 'Huíla',
    slug: 'huila',
    image: '/assets/provinces/huila.webp',
    description: {
      pt: 'Serra da Leba com a icónica estrada sinuosa e clima ameno da montanha',
      en: 'Leba Mountain Range with iconic winding road and mild mountain climate'
    },
    highlights: {
      pt: ['Serra da Leba', 'Fenda da Tundavala', 'Clima Temperado', 'Cultura Nyaneka-Humbe'],
      en: ['Leba Mountain', 'Tundavala Gap', 'Temperate Climate', 'Nyaneka-Humbe Culture']
    },
    touristHeat: {
      level: 'high',
      score: 76,
      trend: 'rising',
      monthlyVisitors: 2400,
      growthRate: 12.8
    },
    popularityRank: 4,
    certifiedPartners: 6,
    averageRating: 4.7
  },
  {
    id: '5',
    name: 'Benguela',
    slug: 'benguela',
    image: '/assets/provinces/benguela.webp',
    description: {
      pt: 'Praias paradisíacas do litoral atlântico e arquitetura colonial preservada',
      en: 'Paradisiacal beaches on the Atlantic coast and preserved colonial architecture'
    },
    highlights: {
      pt: ['Praia Morena', 'Baía de Benguela', 'Arquitetura Colonial', 'Porto do Lobito'],
      en: ['Morena Beach', 'Benguela Bay', 'Colonial Architecture', 'Lobito Port']
    },
    touristHeat: {
      level: 'medium',
      score: 68,
      trend: 'rising',
      monthlyVisitors: 1800,
      growthRate: 9.5
    },
    popularityRank: 5,
    certifiedPartners: 5,
    averageRating: 4.5
  },
  {
    id: '6',
    name: 'Uíge',
    slug: 'uige',
    image: '/assets/provinces/uige-grutas-nzenzo.jpg',
    description: {
      pt: 'Explore as místicas Grutas do Nzenzo, patrimônio natural do antigo reino Kongo',
      en: 'Explore the mystical Nzenzo Caves, natural heritage of the ancient Kongo kingdom'
    },
    highlights: {
      pt: ['Grutas do Nzenzo', 'Cultura Kongo', 'Artesanato Tradicional', 'Café Angolano'],
      en: ['Nzenzo Caves', 'Kongo Culture', 'Traditional Crafts', 'Angolan Coffee']
    },
    touristHeat: {
      level: 'medium',
      score: 62,
      trend: 'rising',
      monthlyVisitors: 1200,
      growthRate: 8.5
    },
    popularityRank: 6,
    certifiedPartners: 4,
    averageRating: 4.6
  },
  {
    id: '7',
    name: 'Cuanza Sul',
    slug: 'cuanza-sul',
    image: '/assets/provinces/cuanza-sul.webp',
    description: {
      pt: 'Reserva Natural do Kissama com safaris africanos e biodiversidade rica',
      en: 'Kissama Natural Reserve with African safaris and rich biodiversity'
    },
    highlights: {
      pt: ['Parque Nacional da Kissama', 'Safaris', 'Rio Cuanza', 'Elefantes e Búfalos'],
      en: ['Kissama National Park', 'Safaris', 'Cuanza River', 'Elephants and Buffalos']
    },
    touristHeat: {
      level: 'medium',
      score: 58,
      trend: 'stable',
      monthlyVisitors: 950,
      growthRate: 2.1
    },
    popularityRank: 7,
    certifiedPartners: 3,
    averageRating: 4.4
  },
  {
    id: '8',
    name: 'Namibe (Costa)',
    slug: 'namibe-costa',
    image: '/assets/provinces/namibe-coast.webp',
    description: {
      pt: 'Costa selvagem atlântica com praias intocadas e pesca artesanal tradicional',
      en: 'Wild Atlantic coast with pristine beaches and traditional artisanal fishing'
    },
    highlights: {
      pt: ['Praias Virgens', 'Pesca Artesanal', 'Vida Marinha', 'Pôr do Sol Épico'],
      en: ['Virgin Beaches', 'Artisanal Fishing', 'Marine Life', 'Epic Sunset']
    },
    touristHeat: {
      level: 'medium',
      score: 55,
      trend: 'rising',
      monthlyVisitors: 850,
      growthRate: 7.2
    },
    popularityRank: 8,
    certifiedPartners: 3,
    averageRating: 4.3
  }
];
