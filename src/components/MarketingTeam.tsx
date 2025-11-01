import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Target, Users, Megaphone, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketingTeamProps {
  language: 'pt' | 'en';
}

const MarketingTeam = ({ language }: MarketingTeamProps) => {
  const navigate = useNavigate();

  const content = {
    pt: {
      badge: 'Especialistas em Marketing Turístico',
      title: 'Impulsionamos o Turismo Angolano',
      subtitle: 'Nossa equipe de especialistas cria campanhas estratégicas para destacar seus serviços',
      description:
        'A Angola ConnecTour não é apenas um hub digital — somos uma agência de marketing especializada no setor turístico angolano. Nossa equipe de profissionais experientes desenvolve campanhas personalizadas, otimiza visibilidade online e conecta parceiros aos viajantes certos.',
      services: [
        {
          icon: Target,
          title: 'Consultoria Estratégica',
          description: 'Análise de mercado e posicionamento competitivo personalizado',
        },
        {
          icon: Megaphone,
          title: 'Campanhas de Marketing',
          description: 'Divulgação multi-canal com foco em resultados mensuráveis',
        },
        {
          icon: TrendingUp,
          title: 'SEO e Visibilidade',
          description: 'Otimização para aparecer nas buscas certas no momento certo',
        },
        {
          icon: Users,
          title: 'Gestão de Reputação',
          description: 'Monitoramento e resposta profissional a avaliações',
        },
        {
          icon: BarChart3,
          title: 'Análise de Performance',
          description: 'Relatórios detalhados com insights acionáveis',
        },
        {
          icon: Sparkles,
          title: 'Branding e Design',
          description: 'Identidade visual profissional que converte visitantes',
        },
      ],
      cta: 'Conhecer Plano Elite',
      subtitle2: 'Suporte dedicado para parceiros Elite',
    },
    en: {
      badge: 'Tourism Marketing Experts',
      title: 'Driving Angolan Tourism Forward',
      subtitle: 'Our team of experts creates strategic campaigns to highlight your services',
      description:
        'Angola ConnecTour is not just a digital hub — we are a marketing agency specialized in the Angolan tourism sector. Our team of experienced professionals develops personalized campaigns, optimizes online visibility and connects partners to the right travelers.',
      services: [
        {
          icon: Target,
          title: 'Strategic Consulting',
          description: 'Market analysis and personalized competitive positioning',
        },
        {
          icon: Megaphone,
          title: 'Marketing Campaigns',
          description: 'Multi-channel promotion focused on measurable results',
        },
        {
          icon: TrendingUp,
          title: 'SEO and Visibility',
          description: 'Optimization to appear in the right searches at the right time',
        },
        {
          icon: Users,
          title: 'Reputation Management',
          description: 'Professional monitoring and response to reviews',
        },
        {
          icon: BarChart3,
          title: 'Performance Analysis',
          description: 'Detailed reports with actionable insights',
        },
        {
          icon: Sparkles,
          title: 'Branding and Design',
          description: 'Professional visual identity that converts visitors',
        },
      ],
      cta: 'Discover Elite Plan',
      subtitle2: 'Dedicated support for Elite partners',
    },
  };

  const text = content[language];

  return (
    <section id="marketing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="mb-4 gradient-hero text-primary-foreground">
            <Sparkles className="h-4 w-4 mr-1" />
            {text.badge}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{text.title}</h2>
          <p className="text-xl text-muted-foreground">{text.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="mb-12 shadow-medium border-none">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-muted-foreground">{text.description}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {text.services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-strong transition-all duration-500 border-none"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card className="gradient-hero text-primary-foreground border-none">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{text.subtitle2}</h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                {language === 'pt'
                  ? 'Parceiros do Plano Elite recebem suporte 24/7, gerente dedicado e campanhas de marketing personalizadas para maximizar resultados.'
                  : 'Elite Plan partners receive 24/7 support, dedicated manager and personalized marketing campaigns to maximize results.'}
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/partner-register')}
                className="hover:scale-105 transition-transform"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {text.cta}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MarketingTeam;
