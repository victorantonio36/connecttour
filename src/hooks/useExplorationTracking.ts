import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface ExplorationEvent {
  category: string;
  province?: string;
  destination?: string;
  eventType?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export const useExplorationTracking = () => {
  const trackExploration = useCallback(async (event: ExplorationEvent) => {
    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Store in localStorage always (for anonymous and authenticated users)
      const storedEvents = JSON.parse(localStorage.getItem('exploration_events') || '[]');
      storedEvents.push({
        ...event,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('exploration_events', JSON.stringify(storedEvents.slice(-100)));

      // Only store in database if user is authenticated (security fix)
      if (user) {
        const { error } = await supabase
          .from('exploration_events')
          .insert([{
            user_id: user.id,
            category: event.category,
            province: event.province || null,
            destination: event.destination || null,
            event_type: event.eventType || 'explore_click',
            metadata: (event.metadata || {}) as Json
          }]);

        if (error) {
          console.error('Error tracking exploration:', error);
        }
      }
    } catch (err) {
      console.error('Exploration tracking error:', err);
    }
  }, []);

  const getRecentExplorations = useCallback(() => {
    const storedEvents = JSON.parse(localStorage.getItem('exploration_events') || '[]');
    return storedEvents;
  }, []);

  return {
    trackExploration,
    getRecentExplorations
  };
};
