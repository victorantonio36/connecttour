import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExplorationEvent {
  category: string;
  province?: string;
  destination?: string;
  eventType?: string;
  metadata?: Record<string, unknown>;
}

export const useExplorationTracking = () => {
  const trackExploration = useCallback(async (event: ExplorationEvent) => {
    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Store in database
      const { error } = await supabase
        .from('exploration_events')
        .insert([{
          user_id: user?.id || null,
          category: event.category,
          province: event.province || null,
          destination: event.destination || null,
          event_type: event.eventType || 'explore_click',
          metadata: event.metadata || {}
        }]);

      if (error) {
        console.error('Error tracking exploration:', error);
      }

      // Also store in localStorage for demo purposes
      const storedEvents = JSON.parse(localStorage.getItem('exploration_events') || '[]');
      storedEvents.push({
        ...event,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('exploration_events', JSON.stringify(storedEvents.slice(-100)));

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
