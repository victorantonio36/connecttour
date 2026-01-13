import { useState, useMemo, useEffect } from 'react';
import { Sparkles, BarChart3, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockPartners, type Partner } from '@/data/servicesData';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { useComparisonTracking } from '@/hooks/useComparisonTracking';
import CurrencySelector from './CurrencySelector';
import SearchInput from './SearchInput';
import ComparisonFilters, { type SortOption } from './ComparisonFilters';
import ComparisonCard from './ComparisonCard';
import ComparisonModal from './ComparisonModal';

interface SmartComparisonSectionProps {
  language: 'pt' | 'en';
}

// TODO: Future - integrate real-time data via partner API
// const { data: partners, isLoading } = useQuery({
//   queryKey: ['partners', selectedCategory, selectedProvince],
//   queryFn: () => fetch('https://api.conecttour.ao/parceiros').then(r => r.json())
// });

const SmartComparisonContent = ({ language }: SmartComparisonSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tourism');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas as Províncias');
  const [sortBy, setSortBy] = useState<SortOption>('value');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { trackCategoryChange, trackSearch, trackCompareSelect } = useComparisonTracking();

  const content = {
    pt: {
      badge: 'Comparador Inteligente',
      title: 'Compare e Escolha',
      subtitle: 'Encontre automaticamente o melhor custo-benefício com conversão de moeda em tempo real',
      categories: {
        tourism: 'Agências',
        hotels: 'Hotéis',
        transport: 'Transporte',
        culture: 'Cultura',
        guides: 'Guias'
      },
      searchPlaceholder: 'Pesquisar por nome, local ou tipo...',
      compare: 'Comparar Selecionados',
      noResults: 'Nenhum serviço encontrado',
      noResultsDesc: 'Tente ajustar os filtros ou pesquisa',
      resultsCount: 'resultados encontrados'
    },
    en: {
      badge: 'Smart Comparator',
      title: 'Compare & Choose',
      subtitle: 'Automatically find the best value with real-time currency conversion',
      categories: {
        tourism: 'Agencies',
        hotels: 'Hotels',
        transport: 'Transport',
        culture: 'Culture',
        guides: 'Guides'
      },
      searchPlaceholder: 'Search by name, location or type...',
      compare: 'Compare Selected',
      noResults: 'No services found',
      noResultsDesc: 'Try adjusting the filters or search',
      resultsCount: 'results found'
    }
  };

  const text = content[language];

  // Filter partners by category and province
  const filteredPartners = useMemo(() => {
    return mockPartners.filter(partner => {
      const matchesCategory = partner.category === selectedCategory;
      const matchesProvince = selectedProvince === 'Todas as Províncias' || partner.province === selectedProvince;
      return matchesCategory && matchesProvince;
    });
  }, [selectedCategory, selectedProvince]);

  // Smart search filtering
  const searchedPartners = useMemo(() => {
    if (!searchQuery.trim()) return filteredPartners;
    
    const query = searchQuery.toLowerCase();
    return filteredPartners.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.province.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.features.some(f => f.toLowerCase().includes(query))
    );
  }, [filteredPartners, searchQuery]);

  // Track search with debounced effect
  useEffect(() => {
    if (searchQuery.trim()) {
      trackSearch(searchQuery, searchedPartners.length);
    }
  }, [searchQuery, searchedPartners.length, trackSearch]);

  // Value score algorithm
  const calculateValueScore = (partner: Partner): number => {
    const ratingScore = (partner.rating / 5) * 100;
    
    const categoryPrices = searchedPartners.map(p => p.pricing.amount);
    const maxPrice = Math.max(...categoryPrices, 1);
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

  // Sort partners
  const sortedPartners = useMemo(() => {
    let sorted = [...searchedPartners];
    
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
  }, [searchedPartners, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    trackCategoryChange(category);
    setCompareList([]); // Clear comparison when changing category
  };

  const toggleCompare = (partner: Partner) => {
    const isAdding = !compareList.includes(partner.id);
    
    if (isAdding && compareList.length >= 3) {
      return; // Max 3 items for comparison
    }
    
    setCompareList(prev => 
      prev.includes(partner.id) 
        ? prev.filter(item => item !== partner.id)
        : [...prev, partner.id]
    );
    
    trackCompareSelect(partner, isAdding);
  };

  const comparePartners = useMemo(() => {
    return mockPartners.filter(p => compareList.includes(p.id));
  }, [compareList]);

  return (
    <section id="comparar" className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md">
            <BarChart3 className="h-4 w-4 mr-1.5" />
            {text.badge}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text">
            {text.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {text.subtitle}
          </p>
        </div>

        {/* Control Bar */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border shadow-sm p-4 mb-8 sticky top-20 z-30">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Left: Currency + Search */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <CurrencySelector />
              <SearchInput 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={text.searchPlaceholder}
                className="flex-1 min-w-[250px]"
              />
            </div>
            
            {/* Right: Filters */}
            <ComparisonFilters
              language={language}
              selectedProvince={selectedProvince}
              onProvinceChange={setSelectedProvince}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
        
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
          <TabsList className="grid w-full grid-cols-5 mb-8 h-12 bg-muted/50">
            {Object.entries(text.categories).map(([key, label]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Compare Button */}
          {compareList.length >= 2 && (
            <div className="flex justify-center mb-6 animate-fade-in">
              <Button 
                onClick={() => setShowCompareModal(true)}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Scale className="mr-2 h-5 w-5" />
                {text.compare} ({compareList.length})
              </Button>
            </div>
          )}

          {/* Results count */}
          {searchQuery && (
            <p className="text-sm text-muted-foreground mb-4 animate-fade-in">
              <span className="font-semibold">{sortedPartners.length}</span> {text.resultsCount}
            </p>
          )}
          
          {/* Results Grid */}
          <TabsContent value={selectedCategory} className="mt-0">
            {sortedPartners.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedPartners.map((partner, index) => (
                  <ComparisonCard 
                    key={partner.id}
                    partner={partner}
                    index={index}
                    language={language}
                    isRecommended={index === 0 && sortBy === 'value'}
                    onCompare={() => toggleCompare(partner)}
                    isComparing={compareList.includes(partner.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">{text.noResults}</h3>
                <p className="text-muted-foreground">{text.noResultsDesc}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Comparison Modal */}
        <ComparisonModal
          open={showCompareModal}
          onOpenChange={setShowCompareModal}
          partners={comparePartners}
          language={language}
        />
      </div>
    </section>
  );
};

// Wrap with CurrencyProvider
const SmartComparisonSection = ({ language }: SmartComparisonSectionProps) => {
  return (
    <CurrencyProvider>
      <SmartComparisonContent language={language} />
    </CurrencyProvider>
  );
};

export default SmartComparisonSection;
