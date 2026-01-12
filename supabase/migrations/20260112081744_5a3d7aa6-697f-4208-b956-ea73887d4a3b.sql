-- Create platform_settings table for admin-editable configurations
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read platform settings
CREATE POLICY "Anyone can view platform settings"
ON public.platform_settings
FOR SELECT
USING (true);

-- Only admins can modify platform settings
CREATE POLICY "Admins can manage platform settings"
ON public.platform_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create exploration_events table for tracking user interactions
CREATE TABLE public.exploration_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category text NOT NULL,
  province text,
  destination text,
  event_type text NOT NULL DEFAULT 'explore_click',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exploration_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events
CREATE POLICY "Users can insert own events"
ON public.exploration_events
FOR INSERT
WITH CHECK (true);

-- Admins can view all events
CREATE POLICY "Admins can view all events"
ON public.exploration_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default platform settings
INSERT INTO public.platform_settings (key, value) VALUES
('contact_info', '{"email": "angolaconecttour@gmail.com", "phone": "+244 923 456 789", "whatsapp": "+244923456789", "instagram": "@angolaconnectour", "facebook": "AngolaConnecTour", "twitter": "@connectour_ao"}'),
('payment_settings', '{"default_currency": "USD", "exchange_rates": {"USD_TO_KZ": 850, "USD_TO_EUR": 0.92}}');