-- Update check_admin_email function to include second admin
CREATE OR REPLACE FUNCTION public.check_admin_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IN ('angolaconecttour@gmail.com', 'victorrossano36@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Update platform_settings with real contact info
UPDATE platform_settings 
SET value = jsonb_build_object(
  'email', 'angolaconecttour@gmail.com',
  'phone', '939319554',
  'whatsapp', '244939319554',
  'address', 'Luanda, Angola'
)
WHERE key = 'contact_info';