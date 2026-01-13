import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrencyContext, type Currency } from '@/contexts/CurrencyContext';
import { useComparisonTracking } from '@/hooks/useComparisonTracking';

const CurrencySelector = () => {
  const { currency, setCurrency, availableCurrencies, getFlag } = useCurrencyContext();
  const { trackCurrencyChange } = useComparisonTracking();

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    trackCurrencyChange(newCurrency);
  };

  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      {availableCurrencies.map((curr) => (
        <Button
          key={curr}
          variant="ghost"
          size="sm"
          onClick={() => handleCurrencyChange(curr)}
          className={cn(
            "h-8 px-3 text-sm font-medium transition-all duration-300",
            currency === curr
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-background/80 text-muted-foreground"
          )}
        >
          <span className="mr-1.5">{getFlag(curr)}</span>
          {curr}
        </Button>
      ))}
    </div>
  );
};

export default CurrencySelector;
