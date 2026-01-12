import { useNavigate } from 'react-router-dom';
import { Building2, Star, TrendingUp, Headphones, BarChart3, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BecomePartnerProps {
  language: 'pt' | 'en';
}

const BecomePartner = ({ language }: BecomePartnerProps) => {
  const navigate = useNavigate();

  const content = {
    pt: {
      title: 'Seja Nosso Parceiro',
      subtitle: 'Junte-se à maior rede de turismo de Angola e aumente a visibilidade do seu negócio',
      cta: 'Começar Agora',
      benefits: [
        {
          icon: Building2,
          title: 'Presença no Hub',
          description: 'Cadastro e listagem na plataforma ConnecTour'
        },
        {
          icon: Star,
          title: 'Certificação',
          description: 'Selo de parceiro verificado e certificado'
        },
        {
          icon: TrendingUp,
          title: 'Mais Visibilidade',
          description: 'Destaque no painel de exploração turística'
        },
        {
          icon: Headphones,
          title: 'Suporte 24/7',
          description: 'Atendimento personalizado para parceiros premium'
        },
        {
          icon: BarChart3,
          title: 'Analytics',
          description: 'Relatórios de desempenho e tendências'
        },
        {
          icon: Zap,
          title: 'Marketing',
          description: 'Campanhas promocionais e recomendações'
        }
      ],
      plans: {
        essential: {
          name: 'Essencial',
          price: 'Gratuito',
          features: ['Cadastro básico', 'Presença no hub', 'Suporte por email']
        },
        premium: {
          name: 'Premium',
          price: 'A partir de $49.99/mês',
          features: ['Destaque no painel', 'Suporte 24/7', 'Analytics avançado', 'Campanhas de marketing']
        }
      }
    },
    en: {
      title: 'Become Our Partner',
      subtitle: "Join Angola's largest tourism network and increase your business visibility",
      cta: 'Get Started',
      benefits: [
        {
          icon: Building2,
          title: 'Hub Presence',
          description: 'Registration and listing on ConnecTour platform'
        },
        {
          icon: Star,
          title: 'Certification',
          description: 'Verified and certified partner badge'
        },
        {
          icon: TrendingUp,
          title: 'More Visibility',
          description: 'Highlight on tourist exploration panel'
        },
        {
          icon: Headphones,
          title: '24/7 Support',
          description: 'Personalized support for premium partners'
        },
        {
          icon: BarChart3,
          title: 'Analytics',
          description: 'Performance reports and trends'
        },
        {
          icon: Zap,
          title: 'Marketing',
          description: 'Promotional campaigns and recommendations'
        }
      ],
      plans: {
        essential: {
          name: 'Essential',
          price: 'Free',
          features: ['Basic registration', 'Hub presence', 'Email support']
        },
        premium: {
          name: 'Premium',
          price: 'From $49.99/month',
          features: ['Panel highlight', '24/7 support', 'Advanced analytics', 'Marketing campaigns']
        }
      }
    }
  };

  const text = content[language];

  return (
    <section id="parceiros" className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4">
            <Building2 className="h-3 w-3 mr-1" />
            {language === 'pt' ? 'Parcerias' : 'Partnerships'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {text.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {text.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {text.benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-strong transition-all duration-300 border-foreground/10 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/partner-register')}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-8 py-6 text-lg"
          >
            {text.cta}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BecomePartner;
