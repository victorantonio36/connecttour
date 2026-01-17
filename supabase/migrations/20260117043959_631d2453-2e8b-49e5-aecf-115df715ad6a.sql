-- =====================================================
-- SECURITY FIXES MIGRATION
-- =====================================================

-- 1. Create public view for partner_companies (excludes sensitive fields)
CREATE VIEW public.partner_companies_public
WITH (security_invoker = on) AS
SELECT 
  id,
  name,
  category,
  provinces,
  description_pt,
  description_en,
  email,
  phone,
  website,
  address,
  logo_url,
  cover_image_url,
  heat_score,
  total_bookings,
  total_reviews,
  average_rating,
  certified,
  approved,
  subscription_status
FROM public.partner_companies
WHERE approved = true AND subscription_status = 'active';

-- 2. Drop overly permissive public policy on partner_companies
DROP POLICY IF EXISTS "Public can view approved companies" ON partner_companies;

-- 3. Create restrictive policy - public cannot access base table directly
CREATE POLICY "Public must use view for access"
ON partner_companies FOR SELECT
TO anon
USING (false);

-- 4. Fix exploration_events - restrict to authenticated users only
DROP POLICY IF EXISTS "Users can insert own events" ON exploration_events;

CREATE POLICY "Authenticated users can insert events"
ON exploration_events FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- 5. Create masked bookings view for partners
CREATE VIEW public.bookings_partner_view
WITH (security_invoker = on) AS
SELECT 
  id,
  company_id,
  service_id,
  booking_date,
  start_date,
  end_date,
  quantity,
  total_amount,
  commission_amount,
  commission_rate,
  currency,
  status,
  payment_status,
  notes,
  created_at,
  updated_at,
  CONCAT(LEFT(customer_name, 1), '***') as customer_name_masked,
  CONCAT('***@', SPLIT_PART(customer_email, '@', 2)) as customer_email_masked,
  CONCAT(LEFT(customer_phone, 4), '****') as customer_phone_masked
FROM public.bookings;

-- 6. Create secure function for partners to get their bookings
CREATE OR REPLACE FUNCTION public.get_partner_bookings(p_company_id uuid)
RETURNS TABLE (
  id uuid,
  service_id uuid,
  booking_date date,
  start_date date,
  end_date date,
  quantity integer,
  total_amount numeric,
  commission_amount numeric,
  currency text,
  status text,
  payment_status text,
  notes text,
  customer_name_masked text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.service_id,
    b.booking_date,
    b.start_date,
    b.end_date,
    b.quantity,
    b.total_amount,
    b.commission_amount,
    b.currency,
    b.status,
    b.payment_status,
    b.notes,
    CONCAT(LEFT(b.customer_name, 1), '***') as customer_name_masked,
    b.created_at
  FROM bookings b
  WHERE b.company_id = p_company_id
  AND EXISTS (
    SELECT 1 FROM partner_companies pc
    WHERE pc.id = p_company_id AND pc.owner_id = auth.uid()
  );
$$;

-- 7. Restrict platform_settings - only allow public access to safe keys
DROP POLICY IF EXISTS "Anyone can view platform settings" ON platform_settings;

CREATE POLICY "Public can view contact settings only"
ON platform_settings FOR SELECT
TO anon, authenticated
USING (
  key IN ('contact_info', 'social_media', 'site_config', 'contact_email', 'contact_phone', 'whatsapp_number', 'address')
  OR has_role(auth.uid(), 'admin'::app_role)
);