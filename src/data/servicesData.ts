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
  },
  {
    id: "2",
    name: "Kizomba Adventures",
    category: "tourism",
    province: "Huambo",
    certified: true,
    rating: 4.7,
    description: "Experiências autênticas no planalto central angolano",
  },
  {
    id: "3",
    name: "Atlantic Safari Angola",
    category: "tourism",
    province: "Benguela",
    certified: true,
    rating: 4.9,
    description: "Turismo costeiro e aventuras no litoral atlântico",
  },
  {
    id: "4",
    name: "Expedições Lunda",
    category: "tourism",
    province: "Lunda Norte",
    certified: false,
    rating: 4.5,
    description: "Descoberta cultural e natural das terras diamantíferas",
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
  },
  {
    id: "6",
    name: "Pousada Serra da Leba",
    category: "hotels",
    province: "Huíla",
    certified: true,
    rating: 4.8,
    description: "Acomodação acolhedora com vista panorâmica das montanhas",
  },
  {
    id: "7",
    name: "Eco Lodge Kalandula",
    category: "hotels",
    province: "Malanje",
    certified: true,
    rating: 4.7,
    description: "Hospedagem sustentável próxima às quedas de Kalandula",
  },
  {
    id: "8",
    name: "Residencial Bengo",
    category: "hotels",
    province: "Bengo",
    certified: false,
    rating: 4.3,
    description: "Estadia confortável para explorar o litoral norte",
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
  },
  {
    id: "10",
    name: "Táxi Seguro Huambo",
    category: "transport",
    province: "Huambo",
    certified: true,
    rating: 4.5,
    description: "Serviço confiável de táxi e tours pela cidade",
  },
  {
    id: "11",
    name: "Namibe Transfer Service",
    category: "transport",
    province: "Namibe",
    certified: true,
    rating: 4.6,
    description: "Transfers para Iona e deserto do Namibe",
  },
  {
    id: "12",
    name: "Express Benguela",
    category: "transport",
    province: "Benguela",
    certified: false,
    rating: 4.2,
    description: "Transporte rápido e económico pela região",
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
  },
  {
    id: "14",
    name: "Casa de Cultura Uíge",
    category: "culture",
    province: "Uíge",
    certified: true,
    rating: 4.6,
    description: "Vivências culturais e artesanato tradicional kongo",
  },
  {
    id: "15",
    name: "Restaurante Terra Mãe",
    category: "culture",
    province: "Huíla",
    certified: true,
    rating: 4.8,
    description: "Culinária tradicional mumuíla e experiências rurais",
  },
  {
    id: "16",
    name: "Mercado Cultural Benguela",
    category: "culture",
    province: "Benguela",
    certified: false,
    rating: 4.4,
    description: "Imersão na cultura local e gastronomia costeira",
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
  },
  {
    id: "18",
    name: "Explore Malanje",
    category: "guides",
    province: "Malanje",
    certified: true,
    rating: 4.8,
    description: "Guia completo com áudio e vídeo das Quedas de Kalandula",
  },
  {
    id: "19",
    name: "Huíla Digital Tour",
    category: "guides",
    province: "Huíla",
    certified: true,
    rating: 4.6,
    description: "Conteúdo exclusivo sobre a Serra da Leba e região",
  },
  {
    id: "20",
    name: "Angola Heritage Guide",
    category: "guides",
    province: "Todas as Províncias",
    certified: true,
    rating: 4.9,
    description: "Guia nacional com patrimônio histórico e cultural",
  },
];
