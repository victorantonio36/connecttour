export const provinces = [
  "Todas as Províncias",
  "Luanda",
  "Bengo",
  "Benguela",
  "Huambo",
  "Huíla",
  "Malanje",
  "Uíge",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cabinda",
  "Zaire",
  "Lunda Norte",
  "Lunda Sul",
  "Moxico",
  "Cuando Cubango",
  "Namibe",
  "Cunene",
  "Bié",
];

export interface Partner {
  id: string;
  name: string;
  category: string;
  province: string;
  certified: boolean;
  rating: number;
  description: string;
  pricing: {
    currency: 'AOA' | 'USD';
    amount: number;
    unit: 'per_night' | 'per_person' | 'per_trip' | 'per_hour' | 'fixed';
    original?: number;
    discount?: number;
  };
  features: string[];
  availability: 'high' | 'medium' | 'low';
  responseTime?: string;
  cancellationPolicy?: 'flexible' | 'moderate' | 'strict';
}

export const mockPartners: Partner[] = [
  // Agências de Turismo
  {
    id: "1",
    name: "Angola Experience Tours",
    category: "tourism",
    province: "Luanda",
    certified: true,
    rating: 4.8,
    description: "Roteiros personalizados por todo o território nacional com guias especializados",
    pricing: {
      currency: 'USD',
      amount: 180,
      unit: 'per_person',
      original: 220,
      discount: 18
    },
    features: ['Guia Especializado', 'Transporte Incluído', 'Refeições', 'Seguro Viagem'],
    availability: 'high',
    responseTime: '< 2 horas',
    cancellationPolicy: 'flexible'
  },
  {
    id: "2",
    name: "Kizomba Adventures",
    category: "tourism",
    province: "Huambo",
    certified: true,
    rating: 4.7,
    description: "Experiências autênticas no planalto central angolano",
    pricing: {
      currency: 'USD',
      amount: 125,
      unit: 'per_person',
    },
    features: ['Tour Cultural', 'Guia Local', 'Almoço Tradicional', 'Visitas Históricas'],
    availability: 'medium',
    responseTime: '< 4 horas',
    cancellationPolicy: 'moderate'
  },
  {
    id: "3",
    name: "Atlantic Safari Angola",
    category: "tourism",
    province: "Benguela",
    certified: true,
    rating: 4.9,
    description: "Turismo costeiro e aventuras no litoral atlântico",
    pricing: {
      currency: 'USD',
      amount: 95,
      unit: 'per_person',
      original: 120,
      discount: 21
    },
    features: ['Safari Costeiro', 'Equipamento Incluído', 'Fotógrafo Profissional', 'Snacks'],
    availability: 'high',
    responseTime: '< 1 hora',
    cancellationPolicy: 'flexible'
  },
  {
    id: "4",
    name: "Expedições Lunda",
    category: "tourism",
    province: "Lunda Norte",
    certified: false,
    rating: 4.5,
    description: "Descoberta cultural e natural das terras diamantíferas",
    pricing: {
      currency: 'USD',
      amount: 210,
      unit: 'per_person',
    },
    features: ['Expedição Completa', 'Acampamento', 'Alimentação', '3 Dias/2 Noites'],
    availability: 'low',
    responseTime: '< 24 horas',
    cancellationPolicy: 'strict'
  },
  {
    id: "21",
    name: "Desert Adventure Namibe",
    category: "tourism",
    province: "Namibe",
    certified: true,
    rating: 4.9,
    description: "Expedições pelo deserto do Namibe e Parque Nacional da Iona",
    pricing: {
      currency: 'USD',
      amount: 280,
      unit: 'per_person',
      original: 350,
      discount: 20
    },
    features: ['4x4 Off-Road', 'Guia Experiente', 'Camping Equipado', 'Todas as Refeições'],
    availability: 'medium',
    responseTime: '< 3 horas',
    cancellationPolicy: 'moderate'
  },
  {
    id: "22",
    name: "Kalandula Experience",
    category: "tourism",
    province: "Malanje",
    certified: true,
    rating: 4.8,
    description: "Tour exclusivo às Quedas de Kalandula e Pedras Negras",
    pricing: {
      currency: 'USD',
      amount: 75,
      unit: 'per_person',
    },
    features: ['Transporte Privado', 'Entrada Parque', 'Guia Fotográfico', 'Água/Snacks'],
    availability: 'high',
    responseTime: '< 2 horas',
    cancellationPolicy: 'flexible'
  },

  // Hotéis e Hospedagem
  {
    id: "5",
    name: "Hotel Trópico",
    category: "hotels",
    province: "Luanda",
    certified: true,
    rating: 4.6,
    description: "Hotel de luxo no coração da capital com vista para a baía",
    pricing: {
      currency: 'USD',
      amount: 180,
      unit: 'per_night',
      original: 220,
      discount: 18
    },
    features: ['WiFi Grátis', 'Piscina', 'Restaurante', 'Spa', 'Vista para Baía'],
    availability: 'medium',
    responseTime: '< 2 horas',
    cancellationPolicy: 'flexible'
  },
  {
    id: "6",
    name: "Pousada Serra da Leba",
    category: "hotels",
    province: "Huíla",
    certified: true,
    rating: 4.8,
    description: "Acomodação acolhedora com vista panorâmica das montanhas",
    pricing: {
      currency: 'USD',
      amount: 85,
      unit: 'per_night',
    },
    features: ['Pequeno-almoço Incluído', 'Vista Montanha', 'Lareira', 'Jardim'],
    availability: 'high',
    responseTime: '< 1 hora',
    cancellationPolicy: 'flexible'
  },
  {
    id: "7",
    name: "Eco Lodge Kalandula",
    category: "hotels",
    province: "Malanje",
    certified: true,
    rating: 4.7,
    description: "Hospedagem sustentável próxima às quedas de Kalandula",
    pricing: {
      currency: 'USD',
      amount: 95,
      unit: 'per_night',
      original: 115,
      discount: 17
    },
    features: ['Eco-Friendly', 'Refeições Orgânicas', 'Tours Incluídos', 'Natureza'],
    availability: 'medium',
    responseTime: '< 3 horas',
    cancellationPolicy: 'moderate'
  },
  {
    id: "8",
    name: "Residencial Bengo",
    category: "hotels",
    province: "Bengo",
    certified: false,
    rating: 4.3,
    description: "Estadia confortável para explorar o litoral norte",
    pricing: {
      currency: 'USD',
      amount: 45,
      unit: 'per_night',
    },
    features: ['Quartos Simples', 'WiFi', 'Estacionamento', 'Ar Condicionado'],
    availability: 'high',
    responseTime: '< 4 horas',
    cancellationPolicy: 'flexible'
  },
  {
    id: "23",
    name: "Benguela Beach Resort",
    category: "hotels",
    province: "Benguela",
    certified: true,
    rating: 4.7,
    description: "Resort à beira-mar com acesso privado à praia",
    pricing: {
      currency: 'USD',
      amount: 145,
      unit: 'per_night',
      original: 180,
      discount: 19
    },
    features: ['Praia Privada', 'Piscina Infinita', 'Restaurante Gourmet', 'Spa', 'Bar'],
    availability: 'medium',
    responseTime: '< 2 horas',
    cancellationPolicy: 'moderate'
  },
  {
    id: "24",
    name: "Namibe Desert Lodge",
    category: "hotels",
    province: "Namibe",
    certified: true,
    rating: 4.8,
    description: "Lodge boutique com vista para o deserto e oceano",
    pricing: {
      currency: 'USD',
      amount: 165,
      unit: 'per_night',
    },
    features: ['Vista Deserto', 'Design Único', 'Gastronomia Local', 'Tours Organizados'],
    availability: 'low',
    responseTime: '< 6 horas',
    cancellationPolicy: 'moderate'
  },
  {
    id: "25",
    name: "Hotel Central Huambo",
    category: "hotels",
    province: "Huambo",
    certified: true,
    rating: 4.5,
    description: "Hotel central com fácil acesso a todas as atrações",
    pricing: {
      currency: 'USD',
      amount: 70,
      unit: 'per_night',
    },
    features: ['Localização Central', 'Café da Manhã', 'WiFi Rápido', 'Recepção 24h'],
    availability: 'high',
    responseTime: '< 1 hora',
    cancellationPolicy: 'flexible'
  },
  {
    id: "26",
    name: "Pousada Uíge Heritage",
    category: "hotels",
    province: "Uíge",
    certified: true,
    rating: 4.6,
    description: "Pousada temática com decoração cultural kongo",
    pricing: {
      currency: 'USD',
      amount: 60,
      unit: 'per_night',
    },
    features: ['Decoração Temática', 'Artesanato Local', 'Café Regional', 'Biblioteca'],
    availability: 'medium',
    responseTime: '< 4 horas',
    cancellationPolicy: 'flexible'
  },

  // Serviços de Táxi e Transfer
  {
    id: "9",
    name: "TransAngola Premium",
    category: "transport",
    province: "Luanda",
    certified: true,
    rating: 4.7,
    description: "Transporte executivo e transfers aeroporto 24/7",
    pricing: {
      currency: 'USD',
      amount: 45,
      unit: 'per_trip',
    },
    features: ['Veículos Novos', 'Motorista Profissional', 'WiFi a Bordo', 'Água Grátis'],
    availability: 'high',
    responseTime: '< 15 minutos',
    cancellationPolicy: 'flexible'
  },
  {
    id: "10",
    name: "Táxi Seguro Huambo",
    category: "transport",
    province: "Huambo",
    certified: true,
    rating: 4.5,
    description: "Serviço confiável de táxi e tours pela cidade",
    pricing: {
      currency: 'USD',
      amount: 25,
      unit: 'per_trip',
    },
    features: ['Preço Fixo', 'Motorista Local', 'Seguro Incluído', 'Pagamento Flexível'],
    availability: 'high',
    responseTime: '< 20 minutos',
    cancellationPolicy: 'flexible'
  },
  {
    id: "11",
    name: "Namibe Transfer Service",
    category: "transport",
    province: "Namibe",
    certified: true,
    rating: 4.6,
    description: "Transfers para Iona e deserto do Namibe",
    pricing: {
      currency: 'USD',
      amount: 120,
      unit: 'per_trip',
      original: 150,
      discount: 20
    },
    features: ['4x4 Equipado', 'Guia Incluso', 'Combustível Incluído', 'Bebidas'],
    availability: 'medium',
    responseTime: '< 1 hora',
    cancellationPolicy: 'moderate'
  },
  {
    id: "12",
    name: "Express Benguela",
    category: "transport",
    province: "Benguela",
    certified: false,
    rating: 4.2,
    description: "Transporte rápido e económico pela região",
    pricing: {
      currency: 'USD',
      amount: 18,
      unit: 'per_trip',
    },
    features: ['Tarifa Económica', 'Cobertura Regional', 'Disponível 24/7'],
    availability: 'high',
    responseTime: '< 30 minutos',
    cancellationPolicy: 'flexible'
  },
  {
    id: "27",
    name: "Malanje City Transfer",
    category: "transport",
    province: "Malanje",
    certified: true,
    rating: 4.6,
    description: "Transfers para Kalandula e principais pontos turísticos",
    pricing: {
      currency: 'USD',
      amount: 55,
      unit: 'per_trip',
    },
    features: ['Van Confortável', 'Ar Condicionado', 'Múltiplas Paradas', 'Guia Turístico'],
    availability: 'medium',
    responseTime: '< 45 minutos',
    cancellationPolicy: 'moderate'
  },

  // Experiências Culturais e Gastronómicas
  {
    id: "13",
    name: "Sabores de Luanda",
    category: "culture",
    province: "Luanda",
    certified: true,
    rating: 4.9,
    description: "Tour gastronómico pelos melhores restaurantes da capital",
    pricing: {
      currency: 'USD',
      amount: 85,
      unit: 'per_person',
    },
    features: ['5 Restaurantes', 'Chef Anfitrião', 'Degustações', 'Bebidas Incluídas'],
    availability: 'medium',
    responseTime: '< 24 horas',
    cancellationPolicy: 'moderate'
  },
  {
    id: "14",
    name: "Casa de Cultura Uíge",
    category: "culture",
    province: "Uíge",
    certified: true,
    rating: 4.6,
    description: "Vivências culturais e artesanato tradicional kongo",
    pricing: {
      currency: 'USD',
      amount: 40,
      unit: 'per_person',
    },
    features: ['Workshop Artesanato', 'Dança Tradicional', 'Histórias Ancestrais', 'Café Kongo'],
    availability: 'high',
    responseTime: '< 12 horas',
    cancellationPolicy: 'flexible'
  },
  {
    id: "15",
    name: "Restaurante Terra Mãe",
    category: "culture",
    province: "Huíla",
    certified: true,
    rating: 4.8,
    description: "Culinária tradicional mumuíla e experiências rurais",
    pricing: {
      currency: 'USD',
      amount: 55,
      unit: 'per_person',
      original: 70,
      discount: 21
    },
    features: ['Menu Tradicional', 'Visita à Fazenda', 'Música Ao Vivo', 'Produtos Orgânicos'],
    availability: 'medium',
    responseTime: '< 24 horas',
    cancellationPolicy: 'moderate'
  },
  {
    id: "16",
    name: "Mercado Cultural Benguela",
    category: "culture",
    province: "Benguela",
    certified: false,
    rating: 4.4,
    description: "Imersão na cultura local e gastronomia costeira",
    pricing: {
      currency: 'USD',
      amount: 30,
      unit: 'per_person',
    },
    features: ['Tour pelo Mercado', 'Degustação Peixe', 'Artesanato Local', 'Guia Bilíngue'],
    availability: 'high',
    responseTime: '< 4 horas',
    cancellationPolicy: 'flexible'
  },
  {
    id: "28",
    name: "Namibe Cultural Experience",
    category: "culture",
    province: "Namibe",
    certified: true,
    rating: 4.7,
    description: "Encontro com comunidades tradicionais do deserto",
    pricing: {
      currency: 'USD',
      amount: 95,
      unit: 'per_person',
    },
    features: ['Visita a Comunidades', 'Almoço Tradicional', 'Artesanato Único', 'Fotografia'],
    availability: 'low',
    responseTime: '< 48 horas',
    cancellationPolicy: 'strict'
  },
  {
    id: "29",
    name: "Malanje Food Tour",
    category: "culture",
    province: "Malanje",
    certified: true,
    rating: 4.6,
    description: "Descoberta gastronómica da região de Malanje",
    pricing: {
      currency: 'USD',
      amount: 42,
      unit: 'per_person',
    },
    features: ['4 Paragens', 'Pratos Típicos', 'Bebidas Locais', 'Histórias Culinárias'],
    availability: 'high',
    responseTime: '< 6 horas',
    cancellationPolicy: 'flexible'
  },

  // Guias Digitais
  {
    id: "17",
    name: "Guia Digital Luanda",
    category: "guides",
    province: "Luanda",
    certified: true,
    rating: 4.7,
    description: "Mapas interativos e roteiros curados pela capital",
    pricing: {
      currency: 'USD',
      amount: 12,
      unit: 'fixed',
    },
    features: ['Mapas Offline', 'Áudio-Guia', 'Realidade Aumentada', 'Atualizações Grátis'],
    availability: 'high',
    responseTime: 'Imediato',
    cancellationPolicy: 'flexible'
  },
  {
    id: "18",
    name: "Explore Malanje",
    category: "guides",
    province: "Malanje",
    certified: true,
    rating: 4.8,
    description: "Guia completo com áudio e vídeo das Quedas de Kalandula",
    pricing: {
      currency: 'USD',
      amount: 8,
      unit: 'fixed',
    },
    features: ['Vídeos HD', 'Áudio Descritivo', 'Galeria de Fotos', 'Dicas de Fotografia'],
    availability: 'high',
    responseTime: 'Imediato',
    cancellationPolicy: 'flexible'
  },
  {
    id: "19",
    name: "Huíla Digital Tour",
    category: "guides",
    province: "Huíla",
    certified: true,
    rating: 4.6,
    description: "Conteúdo exclusivo sobre a Serra da Leba e região",
    pricing: {
      currency: 'USD',
      amount: 10,
      unit: 'fixed',
    },
    features: ['Tour Virtual 360°', 'Histórias Locais', 'Mapa Interativo', 'Recomendações'],
    availability: 'high',
    responseTime: 'Imediato',
    cancellationPolicy: 'flexible'
  },
  {
    id: "20",
    name: "Angola Heritage Guide",
    category: "guides",
    province: "Todas as Províncias",
    certified: true,
    rating: 4.9,
    description: "Guia nacional com patrimônio histórico e cultural",
    pricing: {
      currency: 'USD',
      amount: 25,
      unit: 'fixed',
      original: 35,
      discount: 29
    },
    features: ['Todas Províncias', 'Patrimônio UNESCO', 'Áudio PT/EN', 'Offline Access'],
    availability: 'high',
    responseTime: 'Imediato',
    cancellationPolicy: 'flexible'
  },
  {
    id: "30",
    name: "Namibe Desert Guide",
    category: "guides",
    province: "Namibe",
    certified: true,
    rating: 4.7,
    description: "Guia especializado do deserto e Parque da Iona",
    pricing: {
      currency: 'USD',
      amount: 15,
      unit: 'fixed',
    },
    features: ['GPS Tracking', 'Pontos de Interesse', 'Fauna e Flora', 'Emergência'],
    availability: 'high',
    responseTime: 'Imediato',
    cancellationPolicy: 'flexible'
  },
];
