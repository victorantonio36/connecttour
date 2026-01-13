import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, ArrowRight } from 'lucide-react';
import { featuredProvinces } from '@/data/provincesData';
import HeatIndicator from './HeatIndicator';
import { useNavigate } from 'react-router-dom';
import { useExplorationTracking } from '@/hooks/useExplorationTracking';

interface DiscoverAngolaProps {
  language: 'pt' | 'en';
}

const DiscoverAngola = ({ language }: DiscoverAngolaProps) => {
  const navigate = useNavigate();
  const { trackExploration } = useExplorationTracking();

  const handleExplore = (province: typeof featuredProvinces[0]) => {
    trackExploration({
      category: 'province_explore',
      province: province.name,
      eventType: 'explore_click'
    });
    
    const categoryMap: Record<string, string> = {
      'Luanda': '/explorar/agencias',
      'Benguela': '/explorar/hospedagem',
      'Huíla': '/explorar/experiencias',
      'Namibe': '/explorar/transporte',
      'Malanje': '/explorar/experiencias',
      'Uíge': '/explorar/experiencias',
      'Cuanza Sul': '/explorar/hospedagem'
    };
    
    const route = categoryMap[province.name] || '/explorar/agencias';
    navigate(route);
  };

  const content = {
    pt: {
      title: 'Descubra Angola',
      subtitle: 'Explore províncias por nível de aquecimento turístico e tendências em tempo real',
      partners: 'parceiros',
      explore: 'Explorar'
    },
    en: {
      title: 'Discover Angola',
      subtitle: 'Explore provinces by tourist heat level and real-time trends',
      partners: 'partners',
      explore: 'Explore'
    }
  };

  const text = content[language];

  return (
    <section id="descobrir" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {text.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {text.subtitle}
          </p>
        </div>

        {/* Carousel Netflix-Style */}
        <Carousel
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProvinces
              .sort((a, b) => a.popularityRank - b.popularityRank)
              .map((province, index) => (
                <CarouselItem 
                  key={province.id} 
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="group relative overflow-hidden border-none shadow-medium hover:shadow-strong transition-all duration-500 animate-scale-in">
                    {/* Imagem de Fundo com Overlay */}
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={province.image}
                        alt={province.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                      
                      {/* Indicador de Aquecimento */}
                      <HeatIndicator heat={province.touristHeat} language={language} />
                      
                      {/* Ranking Badge */}
                      <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-sm">
                        #{province.popularityRank}
                      </Badge>
                    </div>
                    
                    {/* Conteúdo do Cartão */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        <h3 className="text-2xl font-bold text-foreground">
                          {province.name}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {province.description[language]}
                      </p>
                      
                      {/* Métricas Rápidas */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-golden fill-golden" />
                          <span>{province.averageRating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{province.certifiedPartners} {text.partners}</span>
                        </div>
                      </div>
                      
                      {/* CTA */}
                      <Button 
                        variant="ghost" 
                        className="w-full text-accent hover:text-accent/80 group-hover:translate-x-1 transition-transform"
                        onClick={() => handleExplore(province)}
                      >
                        {text.explore} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default DiscoverAngola;
