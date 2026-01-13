import { ArrowUpDown, MapPin, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { provinces } from '@/data/servicesData';
import { useComparisonTracking } from '@/hooks/useComparisonTracking';

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'value';

interface ComparisonFiltersProps {
  language: 'pt' | 'en';
  selectedProvince: string;
  onProvinceChange: (province: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const ComparisonFilters = ({
  language,
  selectedProvince,
  onProvinceChange,
  sortBy,
  onSortChange
}: ComparisonFiltersProps) => {
  const { trackFilterChange } = useComparisonTracking();

  const text = {
    pt: {
      province: 'Província',
      allProvinces: 'Todas as Províncias',
      sortBy: 'Ordenar por',
      sort: {
        value: 'Melhor Custo-Benefício',
        'price-asc': 'Menor Preço',
        'price-desc': 'Maior Preço',
        rating: 'Melhor Avaliação'
      }
    },
    en: {
      province: 'Province',
      allProvinces: 'All Provinces',
      sortBy: 'Sort by',
      sort: {
        value: 'Best Value',
        'price-asc': 'Lowest Price',
        'price-desc': 'Highest Price',
        rating: 'Top Rated'
      }
    }
  };

  const handleProvinceChange = (value: string) => {
    onProvinceChange(value);
    trackFilterChange('province', value);
  };

  const handleSortChange = (value: string) => {
    onSortChange(value as SortOption);
    trackFilterChange('sort', value);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Province Filter */}
      <Select value={selectedProvince} onValueChange={handleProvinceChange}>
        <SelectTrigger className="w-[200px] bg-background/80 border-muted-foreground/20 h-10">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder={text[language].province} />
        </SelectTrigger>
        <SelectContent>
          {provinces.map(prov => (
            <SelectItem key={prov} value={prov}>
              {prov === 'Todas as Províncias' && language === 'en' 
                ? text[language].allProvinces 
                : prov}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Sort Filter */}
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[220px] bg-background/80 border-muted-foreground/20 h-10">
          <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(text[language].sort).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ComparisonFilters;
