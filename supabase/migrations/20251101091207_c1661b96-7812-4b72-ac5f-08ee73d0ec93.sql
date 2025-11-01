-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('partner', 'admin', 'moderator');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles RLS policies
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name_pt TEXT NOT NULL,
  display_name_en TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price_monthly_usd DECIMAL(10, 2) NOT NULL,
  price_monthly_aoa DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  features JSONB NOT NULL,
  visibility_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  support_24_7 BOOLEAN DEFAULT FALSE,
  marketing_campaigns BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Anyone can view subscription plans
CREATE POLICY "Anyone can view plans"
  ON public.subscription_plans
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Insert pre-defined subscription plans
INSERT INTO public.subscription_plans (
  name, 
  display_name_pt, 
  display_name_en,
  description_pt,
  description_en,
  price_monthly_usd,
  price_monthly_aoa,
  commission_rate,
  features,
  visibility_multiplier,
  support_24_7,
  marketing_campaigns
) VALUES 
(
  'essencial',
  'Plano Essencial',
  'Essential Plan',
  'Inclusão de serviços na plataforma e painel de exploração com visibilidade padrão',
  'Service inclusion on platform and exploration panel with standard visibility',
  49.99,
  24995.00,
  8.0,
  '{"pt": ["Listagem na Plataforma", "Painel de Exploração", "Visibilidade Padrão", "Sistema de Reservas", "Análise Básica"], "en": ["Platform Listing", "Exploration Panel", "Standard Visibility", "Booking System", "Basic Analytics"]}'::jsonb,
  1.0,
  FALSE,
  FALSE
),
(
  'elite',
  'Plano Elite',
  'Elite Plan',
  'Visibilidade máxima, suporte 24/7 e campanhas de marketing dedicadas',
  'Maximum visibility, 24/7 support and dedicated marketing campaigns',
  149.99,
  74995.00,
  5.0,
  '{"pt": ["Tudo do Essencial", "Visibilidade Dobrada", "Suporte 24/7", "Campanhas de Marketing", "Análise Avançada", "Gerente Dedicado"], "en": ["Everything from Essential", "2x Visibility", "24/7 Support", "Marketing Campaigns", "Advanced Analytics", "Dedicated Manager"]}'::jsonb,
  2.0,
  TRUE,
  TRUE
);

-- Create partner_companies table
CREATE TABLE public.partner_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  tax_id TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('tourism', 'hotels', 'transport', 'culture', 'guides')),
  provinces TEXT[] NOT NULL,
  
  description_pt TEXT NOT NULL,
  description_en TEXT NOT NULL,
  
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  address TEXT NOT NULL,
  
  logo_url TEXT,
  cover_image_url TEXT,
  
  subscription_plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  subscription_status TEXT NOT NULL DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active', 'suspended', 'cancelled')),
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  
  heat_score DECIMAL(5, 2) DEFAULT 0.0,
  total_bookings INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0.0,
  
  certified BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_partner_companies_category ON public.partner_companies(category);
CREATE INDEX idx_partner_companies_provinces ON public.partner_companies USING GIN(provinces);
CREATE INDEX idx_partner_companies_heat_score ON public.partner_companies(heat_score DESC);

-- Enable RLS on partner_companies
ALTER TABLE public.partner_companies ENABLE ROW LEVEL SECURITY;

-- Partners can view own companies
CREATE POLICY "Partners can view own companies"
  ON public.partner_companies
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Partners can create companies
CREATE POLICY "Partners can create companies"
  ON public.partner_companies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid() AND 
    public.has_role(auth.uid(), 'partner')
  );

-- Partners can update own companies
CREATE POLICY "Partners can update own companies"
  ON public.partner_companies
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Admins can manage all companies
CREATE POLICY "Admins can manage all companies"
  ON public.partner_companies
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public can view approved companies
CREATE POLICY "Public can view approved companies"
  ON public.partner_companies
  FOR SELECT
  TO authenticated, anon
  USING (approved = true AND subscription_status = 'active');

-- Create partner_services table
CREATE TABLE public.partner_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.partner_companies(id) ON DELETE CASCADE NOT NULL,
  
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  description_en TEXT NOT NULL,
  
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'AOA')),
  price DECIMAL(10, 2) NOT NULL,
  price_unit TEXT NOT NULL CHECK (price_unit IN ('per_night', 'per_person', 'per_trip', 'per_hour', 'fixed')),
  original_price DECIMAL(10, 2),
  discount_percentage DECIMAL(5, 2),
  
  features JSONB NOT NULL,
  
  availability TEXT NOT NULL DEFAULT 'medium' CHECK (availability IN ('high', 'medium', 'low')),
  response_time TEXT,
  cancellation_policy TEXT CHECK (cancellation_policy IN ('flexible', 'moderate', 'strict')),
  
  images TEXT[],
  
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_partner_services_company ON public.partner_services(company_id);
CREATE INDEX idx_partner_services_price ON public.partner_services(price);

-- Enable RLS on partner_services
ALTER TABLE public.partner_services ENABLE ROW LEVEL SECURITY;

-- Partners can manage own services
CREATE POLICY "Partners can manage own services"
  ON public.partner_services
  FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM public.partner_companies WHERE owner_id = auth.uid()
    )
  );

-- Public can view active services
CREATE POLICY "Public can view active services"
  ON public.partner_services
  FOR SELECT
  TO authenticated, anon
  USING (
    active = true AND 
    company_id IN (
      SELECT id FROM public.partner_companies 
      WHERE approved = true AND subscription_status = 'active'
    )
  );

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.partner_services(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.partner_companies(id) ON DELETE CASCADE NOT NULL,
  
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  booking_date DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  
  notes TEXT,
  cancellation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_company ON public.bookings(company_id);
CREATE INDEX idx_bookings_service ON public.bookings(service_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date DESC);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Partners can view company bookings
CREATE POLICY "Partners can view company bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM public.partner_companies WHERE owner_id = auth.uid()
    )
  );

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create commission_payouts table
CREATE TABLE public.commission_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  company_id UUID REFERENCES public.partner_companies(id) ON DELETE CASCADE NOT NULL,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  total_bookings INTEGER NOT NULL,
  total_revenue DECIMAL(10, 2) NOT NULL,
  total_commission DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  paid_at TIMESTAMPTZ,
  
  payment_method TEXT,
  transaction_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_commission_payouts_company ON public.commission_payouts(company_id);
CREATE INDEX idx_commission_payouts_period ON public.commission_payouts(period_end DESC);

-- Enable RLS on commission_payouts
ALTER TABLE public.commission_payouts ENABLE ROW LEVEL SECURITY;

-- Partners can view own payouts
CREATE POLICY "Partners can view own payouts"
  ON public.commission_payouts
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT id FROM public.partner_companies WHERE owner_id = auth.uid()
    )
  );

-- Admins can manage payouts
CREATE POLICY "Admins can manage payouts"
  ON public.commission_payouts
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger to execute handle_new_user after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate company heat score
CREATE OR REPLACE FUNCTION public.calculate_company_heat_score(company_uuid UUID)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  heat DECIMAL;
  plan_multiplier DECIMAL;
BEGIN
  -- Get plan visibility multiplier
  SELECT sp.visibility_multiplier INTO plan_multiplier
  FROM public.partner_companies pc
  JOIN public.subscription_plans sp ON pc.subscription_plan_id = sp.id
  WHERE pc.id = company_uuid;
  
  -- Calculate score based on bookings, reviews and rating
  SELECT (
    (COALESCE(total_bookings, 0) * 2) + 
    (COALESCE(total_reviews, 0) * 5) + 
    (COALESCE(average_rating, 0) * 10)
  ) * COALESCE(plan_multiplier, 1.0) INTO heat
  FROM public.partner_companies
  WHERE id = company_uuid;
  
  -- Update the heat_score
  UPDATE public.partner_companies
  SET heat_score = heat, updated_at = NOW()
  WHERE id = company_uuid;
  
  RETURN heat;
END;
$$;