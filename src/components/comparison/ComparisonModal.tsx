import { Star, Shield, Check, X, ExternalLink, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import type { Partner } from '@/data/servicesData';

interface ComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partners: Partner[];
  language: 'pt' | 'en';
}

const ComparisonModal = ({ open, onOpenChange, partners, language }: ComparisonModalProps) => {
  const { formatPrice } = useCurrencyContext();

  const text = {
    pt: {
      title: 'Comparação de Serviços',
      subtitle: 'Analise os detalhes lado a lado',
      price: 'Preço',
      rating: 'Avaliação',
      availability: 'Disponibilidade',
      responseTime: 'Tempo de Resposta',
      features: 'Características',
      certified: 'Certificado',
      notCertified: 'Não certificado',
      viewDetails: 'Ver Detalhes',
      availabilityLabels: {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
      }
    },
    en: {
      title: 'Service Comparison',
      subtitle: 'Analyze details side by side',
      price: 'Price',
      rating: 'Rating',
      availability: 'Availability',
      responseTime: 'Response Time',
      features: 'Features',
      certified: 'Certified',
      notCertified: 'Not certified',
      viewDetails: 'View Details',
      availabilityLabels: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      }
    }
  };

  const t = text[language];

  // Find best values for highlighting
  const lowestPrice = Math.min(...partners.map(p => p.pricing.amount));
  const highestRating = Math.max(...partners.map(p => p.rating));
  const mostFeatures = Math.max(...partners.map(p => p.features.length));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-2xl font-bold">{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <div className={cn(
              "grid gap-4",
              partners.length === 2 && "grid-cols-2",
              partners.length === 3 && "grid-cols-3"
            )}>
              {partners.map((partner, index) => (
                <div 
                  key={partner.id}
                  className="bg-card rounded-xl border p-4 space-y-4"
                >
                  {/* Header */}
                  <div className="text-center pb-3 border-b">
                    <h3 className="font-semibold text-lg flex items-center justify-center gap-2">
                      {partner.name}
                      {partner.certified && <Shield className="h-4 w-4 text-accent" />}
                    </h3>
                    <p className="text-sm text-muted-foreground">{partner.province}</p>
                  </div>

                  {/* Price */}
                  <div className={cn(
                    "p-3 rounded-lg text-center",
                    partner.pricing.amount === lowestPrice ? "bg-emerald-50 border border-emerald-200" : "bg-muted/30"
                  )}>
                    <p className="text-xs text-muted-foreground uppercase mb-1">{t.price}</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      partner.pricing.amount === lowestPrice && "text-emerald-600"
                    )}>
                      {formatPrice(partner.pricing.amount)}
                    </p>
                    {partner.pricing.discount && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        -{partner.pricing.discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className={cn(
                    "p-3 rounded-lg text-center",
                    partner.rating === highestRating ? "bg-accent/10 border border-accent/30" : "bg-muted/30"
                  )}>
                    <p className="text-xs text-muted-foreground uppercase mb-1">{t.rating}</p>
                    <div className="flex items-center justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(partner.rating) 
                              ? "text-accent fill-accent" 
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                      <span className={cn(
                        "ml-2 font-semibold",
                        partner.rating === highestRating && "text-accent"
                      )}>
                        {partner.rating}
                      </span>
                    </div>
                  </div>

                  {/* Availability & Response */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-muted/30 text-center">
                      <p className="text-xs text-muted-foreground">{t.availability}</p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "mt-1 text-xs",
                          partner.availability === 'high' && "border-emerald-500 text-emerald-600",
                          partner.availability === 'medium' && "border-amber-500 text-amber-600",
                          partner.availability === 'low' && "border-red-500 text-red-600"
                        )}
                      >
                        {t.availabilityLabels[partner.availability]}
                      </Badge>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 text-center">
                      <p className="text-xs text-muted-foreground">{t.responseTime}</p>
                      <p className="text-sm font-medium mt-1 flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {partner.responseTime || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Certification */}
                  <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-muted/30">
                    {partner.certified ? (
                      <>
                        <Shield className="h-4 w-4 text-accent" />
                        <span className="text-sm text-accent font-medium">{t.certified}</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t.notCertified}</span>
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <div className={cn(
                    "p-3 rounded-lg",
                    partner.features.length === mostFeatures ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                  )}>
                    <p className="text-xs text-muted-foreground uppercase mb-2">{t.features}</p>
                    <div className="space-y-1">
                      {partner.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-secondary flex-shrink-0" />
                          <span className="text-muted-foreground text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full"
                    onClick={() => partner.link && window.open(partner.link, '_blank')}
                    disabled={!partner.link}
                  >
                    {t.viewDetails}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;
