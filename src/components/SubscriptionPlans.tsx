import { Check, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/hooks/useCurrency';

interface SubscriptionPlansProps {
  language: 'pt' | 'en';
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
}

const SubscriptionPlans = ({ language, selectedPlan, onSelectPlan }: SubscriptionPlansProps) => {
  const { formatWithConversion, currency, setCurrency, availableCurrencies } = useCurrency();

  const content = {
    pt: {
      title: 'Escolha o Seu Plano',
      subtitle: 'Selecione o plano que melhor se adapta ao seu negócio',
      monthly: '/mês',
      popular: 'Mais Popular',
      select: 'Selecionar',
      selected: 'Selecionado',
      plans: {
        essential: {
          name: 'Plano Essencial',
          description: 'Ideal para começar a sua presença no hub',
          price: 49.99,
          commission: '8%',
          features: [
            'Cadastro e listagem na plataforma',
            'Presença no painel de exploração',
            'Suporte por email',
            'Acesso ao sistema de reservas',
            'Relatórios básicos de desempenho'
          ]
        },
        elite: {
          name: 'Plano Elite',
          description: 'Para negócios que querem destaque máximo',
          price: 149.99,
          commission: '5%',
          features: [
            'Tudo do plano Essencial',
            'Destaque 2x no painel de exploração',
            'Suporte prioritário 24/7',
            'Campanhas de marketing incluídas',
            'Analytics avançado e insights',
            'Gestor de conta dedicado',
            'Comissão reduzida (5%)'
          ]
        }
      },
      commissionLabel: 'Comissão por reserva'
    },
    en: {
      title: 'Choose Your Plan',
      subtitle: 'Select the plan that best fits your business',
      monthly: '/month',
      popular: 'Most Popular',
      select: 'Select',
      selected: 'Selected',
      plans: {
        essential: {
          name: 'Essential Plan',
          description: 'Ideal for starting your hub presence',
          price: 49.99,
          commission: '8%',
          features: [
            'Platform registration and listing',
            'Presence on exploration panel',
            'Email support',
            'Access to booking system',
            'Basic performance reports'
          ]
        },
        elite: {
          name: 'Elite Plan',
          description: 'For businesses wanting maximum visibility',
          price: 149.99,
          commission: '5%',
          features: [
            'Everything in Essential plan',
            '2x highlight on exploration panel',
            'Priority 24/7 support',
            'Marketing campaigns included',
            'Advanced analytics and insights',
            'Dedicated account manager',
            'Reduced commission (5%)'
          ]
        }
      },
      commissionLabel: 'Commission per booking'
    }
  };

  const text = content[language];
  const plans = [
    { id: 'essencial', ...text.plans.essential, popular: false },  // Matches DB 'essencial'
    { id: 'elite', ...text.plans.elite, popular: true }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">{text.title}</h3>
        <p className="text-muted-foreground mb-4">{text.subtitle}</p>
        
        {/* Currency Selector */}
        <div className="flex items-center justify-center gap-2">
          {availableCurrencies.map((curr) => (
            <Button
              key={curr}
              variant={currency === curr ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrency(curr)}
            >
              {curr}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <Card 
              key={plan.id}
              className={`relative transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'border-primary shadow-strong ring-2 ring-primary' 
                  : 'border-foreground/10 hover:border-primary/50 hover:shadow-medium'
              } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              onClick={() => onSelectPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent">
                  <Star className="h-3 w-3 mr-1" />
                  {text.popular}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary to-accent' 
                    : 'bg-muted'
                }`}>
                  {plan.popular ? (
                    <Zap className="h-8 w-8 text-primary-foreground" />
                  ) : (
                    <Star className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <span className="text-4xl font-bold text-foreground">
                    {formatWithConversion(plan.price)}
                  </span>
                  <span className="text-muted-foreground">{text.monthly}</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {text.commissionLabel}: <span className="font-semibold text-foreground">{plan.commission}</span>
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                        plan.popular ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <Button 
                  className={`w-full ${
                    isSelected 
                      ? 'bg-primary' 
                      : plan.popular 
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90' 
                        : ''
                  }`}
                  variant={isSelected ? 'default' : plan.popular ? 'default' : 'outline'}
                >
                  {isSelected ? text.selected : text.select}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
