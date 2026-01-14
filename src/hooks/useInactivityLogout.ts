import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseInactivityLogoutOptions {
  timeout?: number; // milliseconds (default: 15 minutes)
  enabled?: boolean;
}

export const useInactivityLogout = ({
  timeout = 900000, // 15 minutes
  enabled = true
}: UseInactivityLogoutOptions = {}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Sessão expirada',
      description: 'Por segurança, a sessão foi encerrada após 15 minutos de inatividade.'
    });
    navigate('/');
  }, [navigate, toast]);

  useEffect(() => {
    if (!enabled) return;

    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(handleLogout, timeout);
    };

    // Events that reset the timer
    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // Start the timer
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [enabled, timeout, handleLogout]);
};
