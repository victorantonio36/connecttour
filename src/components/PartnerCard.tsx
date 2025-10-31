import { Star, Shield, Check, Clock, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Partner } from '@/data/servicesData';

interface PartnerCardProps {
  partner: Partner;
  index: number;
  language: 'pt' | 'en';
  isRecommended: boolean;
  onCompare: () => void;
  isComparing: boolean;
}

const PartnerCard = ({ 
  partner, 
  index, 
  language, 
  isRecommended, 
  onCompare, 
  isComparing 
}: PartnerCardProps) => {
  const unitLabels = {
    per_night: { pt: '/noite', en: '/night' },
    per_person: { pt: '/pessoa', en: '/person' },
    per_trip: { pt: '/viagem', en: '/trip' },
    per_hour: { pt: '/hora', en: '/hour' },
    fixed: { pt: '', en: '' }
  };

  const availabilityLabels = {
    high: { pt: 'Alta', en: 'High' },
    medium: { pt: 'Média', en: 'Medium' },
    low: { pt: 'Baixa', en: 'Low' }
  };

  const text = {
    pt: {
      recommended: 'Recomendado',
      viewDetails: 'Ver Detalhes',
      availability: 'Disponibilidade',
      more: 'mais'
    },
    en: {
      recommended: 'Recommended',
      viewDetails: 'View Details',
      availability: 'Availability',
      more: 'more'
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden hover:shadow-strong transition-all duration-500 animate-scale-in",
        isRecommended && "border-2 border-accent shadow-medium"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Badge Recomendado */}
      {isRecommended && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-golden to-accent" />
      )}
      
      {/* Checkbox de Comparação */}
      <div className="absolute top-4 right-4 z-10">
        <Checkbox 
          checked={isComparing}
          onCheckedChange={onCompare}
          className="bg-background/80 backdrop-blur-sm"
        />
      </div>
      
      <CardHeader>
        {isRecommended && (
          <Badge className="mb-2 w-fit bg-gradient-to-r from-accent to-golden text-primary-foreground">
            <Zap className="h-3 w-3 mr-1" />
            {text[language].recommended}
          </Badge>
        )}
        
        <CardTitle className="text-xl flex items-start justify-between pr-8">
          {partner.name}
          {partner.certified && (
            <Shield className="h-5 w-5 text-accent flex-shrink-0" />
          )}
        </CardTitle>
        
        <CardDescription className="line-clamp-2">
          {partner.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preço Destacado */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {partner.pricing.currency} {partner.pricing.amount.toLocaleString()}
            </span>
            {partner.pricing.original && (
              <span className="text-sm text-muted-foreground line-through">
                {partner.pricing.currency} {partner.pricing.original.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {unitLabels[partner.pricing.unit][language]}
          </p>
          {partner.pricing.discount && (
            <Badge variant="destructive" className="text-xs">
              -{partner.pricing.discount}% OFF
            </Badge>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(partner.rating) 
                    ? "text-golden fill-golden" 
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{partner.rating}</span>
        </div>
        
        {/* Features (3 primeiras) */}
        <div className="space-y-1.5">
          {partner.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
          {partner.features.length > 3 && (
            <p className="text-xs text-accent">
              +{partner.features.length - 3} {text[language].more}
            </p>
          )}
        </div>
        
        {/* Badges de Info */}
        <div className="flex flex-wrap gap-2">
          {partner.responseTime && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              {partner.responseTime}
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              partner.availability === 'high' && "border-green-500 text-green-500",
              partner.availability === 'medium' && "border-yellow-500 text-yellow-500",
              partner.availability === 'low' && "border-red-500 text-red-500"
            )}
          >
            {text[language].availability}: {availabilityLabels[partner.availability][language]}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
          {text[language].viewDetails}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PartnerCard;
