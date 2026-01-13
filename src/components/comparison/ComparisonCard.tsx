import { useState } from 'react';
import { Star, Shield, Check, Clock, Zap, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { useComparisonTracking } from '@/hooks/useComparisonTracking';
import { useToast } from '@/hooks/use-toast';
import type { Partner } from '@/data/servicesData';

interface ComparisonCardProps {
  partner: Partner;
  index: number;
  language: 'pt' | 'en';
  isRecommended: boolean;
  onCompare: () => void;
  isComparing: boolean;
}

const ComparisonCard = ({ 
  partner, 
  index, 
  language, 
  isRecommended, 
  onCompare, 
  isComparing 
}: ComparisonCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { formatPrice, currency, getSymbol } = useCurrencyContext();
  const { trackPartnerClick } = useComparisonTracking();
  const { toast } = useToast();

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
      recommended: 'Melhor Custo-Benefício',
      viewDetails: 'Ver Detalhes',
      availability: 'Disponibilidade',
      more: 'mais',
      noLink: 'Link não disponível',
      noLinkDesc: 'Este parceiro ainda não configurou seu link externo.'
    },
    en: {
      recommended: 'Best Value',
      viewDetails: 'View Details',
      availability: 'Availability',
      more: 'more',
      noLink: 'Link unavailable',
      noLinkDesc: 'This partner has not yet configured their external link.'
    }
  };

  const handleViewDetails = async () => {
    setIsLoading(true);
    
    // Brief loading animation (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Track the click
    trackPartnerClick(partner, partner.link);
    
    setIsLoading(false);
    
    if (partner.link) {
      window.open(partner.link, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: text[language].noLink,
        description: text[language].noLinkDesc,
        variant: "default"
      });
    }
  };

  // Calculate converted price
  const convertedPrice = formatPrice(partner.pricing.amount);
  const convertedOriginal = partner.pricing.original 
    ? formatPrice(partner.pricing.original) 
    : null;

  return (
    <Card 
      className={cn(
        "comparison-card group relative overflow-hidden transition-all duration-400 ease-out",
        "hover:shadow-xl hover:-translate-y-1",
        "will-change-transform backface-visibility-hidden",
        isRecommended && "border-2 border-accent shadow-lg ring-2 ring-accent/20",
        isComparing && "ring-2 ring-primary/50"
      )}
      style={{ 
        animationDelay: `${index * 80}ms`,
        transform: 'translateZ(0)'
      }}
    >
      {/* Recommended indicator bar */}
      {isRecommended && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-secondary to-accent animate-shimmer" />
      )}
      
      {/* Comparison checkbox */}
      <div className="absolute top-4 right-4 z-10">
        <Checkbox 
          checked={isComparing}
          onCheckedChange={onCompare}
          className="bg-background/90 backdrop-blur-sm border-2 h-5 w-5 transition-transform hover:scale-110"
        />
      </div>
      
      <CardHeader className="pb-3">
        {isRecommended && (
          <Badge className="mb-2 w-fit bg-gradient-to-r from-accent to-secondary text-primary-foreground shadow-sm animate-fade-in">
            <Zap className="h-3 w-3 mr-1" />
            {text[language].recommended}
          </Badge>
        )}
        
        <CardTitle className="text-xl flex items-start justify-between pr-8 group-hover:text-primary transition-colors">
          {partner.name}
          {partner.certified && (
            <Shield className="h-5 w-5 text-accent flex-shrink-0 animate-pulse" />
          )}
        </CardTitle>
        
        <CardDescription className="line-clamp-2 text-sm">
          {partner.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price with currency conversion */}
        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-bold text-foreground">
              {convertedPrice}
            </span>
            {convertedOriginal && (
              <span className="text-sm text-muted-foreground line-through">
                {convertedOriginal}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {unitLabels[partner.pricing.unit][language]}
          </p>
          {partner.pricing.discount && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              -{partner.pricing.discount}% OFF
            </Badge>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={cn(
                  "h-4 w-4 transition-colors",
                  i < Math.floor(partner.rating) 
                    ? "text-accent fill-accent" 
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold">{partner.rating}</span>
        </div>
        
        {/* Features (first 3) */}
        <div className="space-y-1.5">
          {partner.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-secondary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
          {partner.features.length > 3 && (
            <p className="text-xs text-primary font-medium">
              +{partner.features.length - 3} {text[language].more}
            </p>
          )}
        </div>
        
        {/* Info badges */}
        <div className="flex flex-wrap gap-2">
          {partner.responseTime && (
            <Badge variant="secondary" className="text-xs gap-1 bg-secondary/10 text-secondary-foreground">
              <Clock className="h-3 w-3" />
              {partner.responseTime}
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs transition-colors",
              partner.availability === 'high' && "border-emerald-500 text-emerald-600 bg-emerald-50",
              partner.availability === 'medium' && "border-amber-500 text-amber-600 bg-amber-50",
              partner.availability === 'low' && "border-red-500 text-red-600 bg-red-50"
            )}
          >
            {text[language].availability}: {availabilityLabels[partner.availability][language]}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className={cn(
            "w-full transition-all duration-300 group/btn",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "active:scale-[0.98]"
          )}
          onClick={handleViewDetails}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {text[language].viewDetails}
              <ExternalLink className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComparisonCard;
