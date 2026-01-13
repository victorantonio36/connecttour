import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Currency = 'USD' | 'KZ' | 'EUR';

interface CurrencyConfig {
  symbol: string;
  name: string;
  locale: string;
  flag: string;
}

const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  USD: { symbol: '$', name: 'Dólar Americano', locale: 'en-US', flag: '🇺🇸' },
  KZ: { symbol: 'Kz', name: 'Kwanza Angolano', locale: 'pt-AO', flag: '🇦🇴' },
  EUR: { symbol: '€', name: 'Euro', locale: 'pt-PT', flag: '🇪🇺' }
};

// Updated exchange rates as per spec: 1 USD = 880 KZ
const EXCHANGE_RATES: Record<string, number> = {
  USD_TO_KZ: 880,
  USD_TO_EUR: 0.93,
  KZ_TO_USD: 1 / 880,
  KZ_TO_EUR: (1 / 880) * 0.93,
  EUR_TO_USD: 1 / 0.93,
  EUR_TO_KZ: (1 / 0.93) * 880
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amount: number, from: Currency, to: Currency) => number;
  format: (amount: number, targetCurrency?: Currency) => string;
  formatPrice: (amountUSD: number) => string;
  getSymbol: (curr?: Currency) => string;
  getCurrencyName: (curr?: Currency) => string;
  getFlag: (curr?: Currency) => string;
  availableCurrencies: Currency[];
  currencyConfig: typeof CURRENCY_CONFIG;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
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

  const formatPrice = useCallback((amountUSD: number): string => {
    const converted = convert(amountUSD, 'USD', currency);
    return format(converted, currency);
  }, [currency, convert, format]);

  const getSymbol = useCallback((curr?: Currency): string => {
    return CURRENCY_CONFIG[curr || currency].symbol;
  }, [currency]);

  const getCurrencyName = useCallback((curr?: Currency): string => {
    return CURRENCY_CONFIG[curr || currency].name;
  }, [currency]);

  const getFlag = useCallback((curr?: Currency): string => {
    return CURRENCY_CONFIG[curr || currency].flag;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convert,
      format,
      formatPrice,
      getSymbol,
      getCurrencyName,
      getFlag,
      availableCurrencies: Object.keys(CURRENCY_CONFIG) as Currency[],
      currencyConfig: CURRENCY_CONFIG
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrencyContext must be used within a CurrencyProvider');
  }
  return context;
};
