
-- 1. Restrict profiles SELECT to authenticated users only
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 2. Remove anon read policy on category-files storage
DROP POLICY IF EXISTS "Public can read category files" ON storage.objects;

-- 3. Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role remains executable by 'authenticated' because it is required for RLS policy evaluation on categories/content/user_roles.
