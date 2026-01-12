import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Partner {
  id: string;
  name: string;
  logo?: string;
  description: string;
  rating: number;
  certified: boolean;
  province: string;
  services?: string[];
}

interface ExplorarLayoutProps {
  title: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  category: string;
  partners: Partner[];
  actionLabel: { pt: string; en: string };
  onPartnerClick?: (partner: Partner) => void;
}

const ExplorarLayout = ({
  title,
  subtitle,
  category,
  partners,
  actionLabel,
  onPartnerClick
}: ExplorarLayoutProps) => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const content = {
    pt: {
      back: 'Voltar',
      connecting: 'Conectando ao destino...',
      demoBanner: 'Você está a explorar uma demonstração interativa da ConnecTour. Em breve, esta função estará integrada com os provedores oficiais do nosso hub.',
      rating: 'Avaliação',
      certified: 'Certificado',
      partners: 'parceiros disponíveis',
      noPartners: 'Nenhum parceiro disponível nesta categoria no momento.'
    },
    en: {
      back: 'Back',
      connecting: 'Connecting to destination...',
      demoBanner: 'You are exploring an interactive demo of ConnecTour. Soon, this feature will be integrated with official providers from our hub.',
      rating: 'Rating',
      certified: 'Certified',
      partners: 'partners available',
      noPartners: 'No partners available in this category at the moment.'
    }
  };

  const text = content[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePartnerAction = (partner: Partner) => {
    if (onPartnerClick) {
      onPartnerClick(partner);
    } else {
      // Default: show toast or navigate
      console.log('Partner clicked:', partner);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground animate-pulse">{text.connecting}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation language={language} setLanguage={setLanguage} />
      
      <main className="container mx-auto px-4 py-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {text.back}
        </Button>

        {/* Demo Banner */}
        <Alert className="mb-8 border-accent/50 bg-accent/10">
          <Info className="h-4 w-4 text-accent" />
          <AlertDescription className="text-foreground/80">
            {text.demoBanner}
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title[language]}
          </h1>
          <p className="text-xl text-muted-foreground">
            {subtitle[language]}
          </p>
          <Badge variant="secondary" className="mt-4">
            {partners.length} {text.partners}
          </Badge>
        </div>

        {/* Partners Grid */}
        {partners.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <Card
                key={partner.id}
                className="group hover:shadow-strong transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-lg">
                            {partner.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{partner.province}</p>
                      </div>
                    </div>
                    {partner.certified && (
                      <Badge variant="default" className="text-xs">
                        {text.certified}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {partner.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-golden">★</span>
                      <span className="text-sm font-medium">{partner.rating.toFixed(1)}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handlePartnerAction(partner)}
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      {actionLabel[language]}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">{text.noPartners}</p>
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
};

export default ExplorarLayout;
