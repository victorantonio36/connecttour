import { useCallback } from 'react';
import type { Partner } from '@/data/servicesData';

interface TrackingEvent {
  type: 'view_details' | 'category_change' | 'filter_change' | 'search' | 'compare_select' | 'currency_change';
  timestamp: string;
  data: Record<string, string | number | boolean | null>;
}

export const useComparisonTracking = () => {
  const trackEvent = useCallback((event: TrackingEvent) => {
    // Log for development/demo purposes
    console.log(`[ConnecTour Analytics] ${event.type}:`, event.data);
    
    // TODO: Future - send to analytics API
    // fetch('/api/analytics', { 
    //   method: 'POST', 
    //   body: JSON.stringify(event),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  }, []);

  const trackPartnerClick = useCallback((partner: Partner, link?: string) => {
    trackEvent({
      type: 'view_details',
      timestamp: new Date().toISOString(),
      data: {
        partnerId: partner.id,
        partnerName: partner.name,
        category: partner.category,
        province: partner.province,
        price: partner.pricing.amount,
        link: link || null
      }
    });
    
    // Visible console log for demo
    console.log("Usuário visitou:", partner.name, "Link:", link || 'N/A');
  }, [trackEvent]);

  const trackCategoryChange = useCallback((category: string) => {
    trackEvent({
      type: 'category_change',
      timestamp: new Date().toISOString(),
      data: { category }
    });
  }, [trackEvent]);

  const trackFilterChange = useCallback((filterType: string, value: string) => {
    trackEvent({
      type: 'filter_change',
      timestamp: new Date().toISOString(),
      data: { filterType, value }
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent({
      type: 'search',
      timestamp: new Date().toISOString(),
      data: { query, resultsCount }
    });
  }, [trackEvent]);

  const trackCompareSelect = useCallback((partner: Partner, isAdding: boolean) => {
    trackEvent({
      type: 'compare_select',
      timestamp: new Date().toISOString(),
      data: {
        partnerId: partner.id,
        partnerName: partner.name,
        action: isAdding ? 'add' : 'remove'
      }
    });
  }, [trackEvent]);

  const trackCurrencyChange = useCallback((currency: string) => {
    trackEvent({
      type: 'currency_change',
      timestamp: new Date().toISOString(),
      data: { currency }
    });
  }, [trackEvent]);

  return {
    trackPartnerClick,
    trackCategoryChange,
    trackFilterChange,
    trackSearch,
    trackCompareSelect,
    trackCurrencyChange
  };
};
