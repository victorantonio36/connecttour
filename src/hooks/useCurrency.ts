import { useState, useCallback } from 'react';

export type Currency = 'USD' | 'KZ' | 'EUR';

interface CurrencyConfig {
  symbol: string;
  name: string;
  locale: string;
}

const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  USD: { symbol: '$', name: 'Dólar Americano', locale: 'en-US' },
  KZ: { symbol: 'Kz', name: 'Kwanza Angolano', locale: 'pt-AO' },
  EUR: { symbol: '€', name: 'Euro', locale: 'pt-PT' }
};

const EXCHANGE_RATES: Record<string, number> = {
  USD_TO_KZ: 850,
  USD_TO_EUR: 0.92,
  KZ_TO_USD: 1 / 850,
  KZ_TO_EUR: (1 / 850) * 0.92,
  EUR_TO_USD: 1 / 0.92,
  EUR_TO_KZ: (1 / 0.92) * 850
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const convert = useCallback((amount: number, from: Currency, to: Currency): number => {
    if (from === to) return amount;
    
    const rateKey = `${from}_TO_${to}`;
    const rate = EXCHANGE_RATES[rateKey];
    
    if (rate) {
      return amount * rate;
    }
    
    // Fallback: convert through USD
    const toUSD = from === 'USD' ? amount : amount * EXCHANGE_RATES[`${from}_TO_USD`];
    return to === 'USD' ? toUSD : toUSD * EXCHANGE_RATES[`USD_TO_${to}`];
  }, []);

  const format = useCallback((amount: number, targetCurrency?: Currency): string => {
    const curr = targetCurrency || currency;
    const config = CURRENCY_CONFIG[curr];
    
    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: curr === 'KZ' ? 'AOA' : curr,
      minimumFractionDigits: curr === 'KZ' ? 0 : 2,
      maximumFractionDigits: curr === 'KZ' ? 0 : 2
    });
    
    return formatter.format(amount);
  }, [currency]);

  const formatWithConversion = useCallback((amountInUSD: number, targetCurrency?: Currency): string => {
    const curr = targetCurrency || currency;
    const converted = convert(amountInUSD, 'USD', curr);
    return format(converted, curr);
  }, [currency, convert, format]);

  const getSymbol = useCallback((curr?: Currency): string => {
    return CURRENCY_CONFIG[curr || currency].symbol;
  }, [currency]);

  const getCurrencyName = useCallback((curr?: Currency): string => {
    return CURRENCY_CONFIG[curr || currency].name;
  }, [currency]);

  return {
    currency,
    setCurrency,
    convert,
    format,
    formatWithConversion,
    getSymbol,
    getCurrencyName,
    availableCurrencies: Object.keys(CURRENCY_CONFIG) as Currency[]
  };
};
