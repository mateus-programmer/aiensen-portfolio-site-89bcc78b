
-- Drop the existing public policy
DROP POLICY "Content viewable by everyone" ON public.content_items;

-- Create new policy: only authenticated users can view content
CREATE POLICY "Content viewable by authenticated users"
ON public.content_items
FOR SELECT
TO authenticated
USING (is_active = true);
