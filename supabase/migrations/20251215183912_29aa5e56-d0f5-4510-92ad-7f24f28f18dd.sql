
-- Create admin audit logs table
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert audit logs
CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_logs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger function to auto-assign admin role
CREATE OR REPLACE FUNCTION public.check_admin_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'angolaconecttour@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for admin assignment
CREATE TRIGGER on_auth_user_created_check_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_admin_email();

-- Create storage buckets for media management
INSERT INTO storage.buckets (id, name, public) VALUES ('platform-media', 'platform-media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-logos', 'partner-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-covers', 'partner-covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Storage policies for platform-media (admins only for upload)
CREATE POLICY "Public can view platform media"
ON storage.objects FOR SELECT
USING (bucket_id = 'platform-media');

CREATE POLICY "Admins can upload platform media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'platform-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update platform media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'platform-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete platform media"
ON storage.objects FOR DELETE
USING (bucket_id = 'platform-media' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for partner-logos
CREATE POLICY "Public can view partner logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-logos');

CREATE POLICY "Admins and partners can upload partner logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partner-logos' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'partner')));

CREATE POLICY "Admins can manage partner logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete partner logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for partner-covers
CREATE POLICY "Public can view partner covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-covers');

CREATE POLICY "Admins and partners can upload partner covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partner-covers' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'partner')));

CREATE POLICY "Admins can manage partner covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'partner-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete partner covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'partner-covers' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for service-images
CREATE POLICY "Public can view service images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Admins and partners can upload service images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'service-images' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'partner')));

CREATE POLICY "Admins can manage service images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service images"
ON storage.objects FOR DELETE
USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

-- Add admin full access policies for bookings (UPDATE and DELETE)
CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
ON public.bookings FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policy for profiles INSERT
CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin policy for profiles DELETE
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add unique constraint for user_roles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

-- Enable realtime for audit logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_audit_logs;
