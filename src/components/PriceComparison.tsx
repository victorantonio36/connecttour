import { useState, useMemo } from 'react';
import { ArrowUpDown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockPartners, type Partner, provinces } from '@/data/servicesData';
import PartnerCard from './PartnerCard';

interface PriceComparisonProps {
  language: 'pt' | 'en';
}

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'value';

const PriceComparison = ({ language }: PriceComparisonProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tourism');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas as Províncias');
  const [sortBy, setSortBy] = useState<SortOption>('value');
  const [compareList, setCompareList] = useState<string[]>([]);

  const content = {
    pt: {
      badge: 'Inteligência de Preços',
      title: 'Comparação Inteligente',
      subtitle: 'Encontre automaticamente o melhor custo-benefício em todas as categorias',
      categories: {
        tourism: 'Agências',
        hotels: 'Hotéis',
        transport: 'Transporte',
        culture: 'Cultura',
        guides: 'Guias'
      },
      sort: {
        value: 'Melhor Custo-Benefício',
        'price-asc': 'Menor Preço',
        'price-desc': 'Maior Preço',
        rating: 'Melhor Avaliação'
      },
      compare: 'Comparar'
    },
    en: {
      badge: 'Price Intelligence',
      title: 'Smart Comparison',
      subtitle: 'Automatically find the best value across all categories',
      categories: {
        tourism: 'Agencies',
        hotels: 'Hotels',
        transport: 'Transport',
        culture: 'Culture',
        guides: 'Guides'
      },
      sort: {
        value: 'Best Value',
        'price-asc': 'Lowest Price',
        'price-desc': 'Highest Price',
        rating: 'Top Rated'
      },
      compare: 'Compare'
    }
  };

  const text = content[language];

  // Filtrar parceiros
  const filteredPartners = useMemo(() => {
    return mockPartners.filter(partner => {
      const matchesCategory = partner.category === selectedCategory;
      const matchesProvince = selectedProvince === 'Todas as Províncias' || partner.province === selectedProvince;
      return matchesCategory && matchesProvince;
    });
  }, [selectedCategory, selectedProvince]);

  // Algoritmo de custo-benefício
  const calculateValueScore = (partner: Partner): number => {
    const ratingScore = (partner.rating / 5) * 100;
    
    const categoryPrices = filteredPartners.map(p => p.pricing.amount);
    const maxPrice = Math.max(...categoryPrices);
    const minPrice = Math.min(...categoryPrices);
    const priceScore = maxPrice === minPrice ? 50 : 100 - ((partner.pricing.amount - minPrice) / (maxPrice - minPrice)) * 100;
    
    const certBonus = partner.certified ? 10 : 0;
    const availBonus = { high: 10, medium: 5, low: 0 }[partner.availability];
    const discountBonus = partner.pricing.discount ? partner.pricing.discount * 0.5 : 0;
    
    const finalScore = (
      ratingScore * 0.35 +
      priceScore * 0.40 +
      certBonus +
      availBonus +
      discountBonus
    );
    
    return Math.min(finalScore, 100);
  };

  // Ordenar parceiros
  const sortedPartners = useMemo(() => {
    let sorted = [...filteredPartners];
    
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.pricing.amount - b.pricing.amount);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.pricing.amount - a.pricing.amount);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'value':
        sorted.sort((a, b) => calculateValueScore(b) - calculateValueScore(a));
        break;
    }
    
    return sorted;
  }, [filteredPartners, sortBy]);

  const toggleCompare = (id: string) => {
    setCompareList(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section id="comparar" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <Badge className="mb-4 bg-gradient-to-r from-accent to-golden text-primary-foreground">
            <Sparkles className="h-4 w-4 mr-1" />
            {text.badge}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {text.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {text.subtitle}
          </p>
        </div>
        
        {/* Filtros por Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="tourism">{text.categories.tourism}</TabsTrigger>
            <TabsTrigger value="hotels">{text.categories.hotels}</TabsTrigger>
            <TabsTrigger value="transport">{text.categories.transport}</TabsTrigger>
            <TabsTrigger value="culture">{text.categories.culture}</TabsTrigger>
            <TabsTrigger value="guides">{text.categories.guides}</TabsTrigger>
          </TabsList>
          
          {/* Controles de Ordenação */}
          <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provinces.map(prov => (
                  <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[220px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(text.sort).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {compareList.length > 0 && (
              <Button variant="default" className="bg-gradient-to-r from-accent to-golden text-primary-foreground">
                {text.compare} ({compareList.length})
              </Button>
            )}
          </div>
          
          {/* Grid de Resultados */}
          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPartners.map((partner, index) => (
                <PartnerCard 
                  key={partner.id}
                  partner={partner}
                  index={index}
                  language={language}
                  isRecommended={index === 0 && sortBy === 'value'}
                  onCompare={() => toggleCompare(partner.id)}
                  isComparing={compareList.includes(partner.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PriceComparison;
