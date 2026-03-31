
-- Create storage bucket for category files
INSERT INTO storage.buckets (id, name, public) VALUES ('category-files', 'category-files', true);

-- RLS policies for the bucket
CREATE POLICY "Authenticated users can view files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'category-files');

CREATE POLICY "Admins can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'category-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'category-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read category files"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'category-files');

-- Add file_url column to content_items
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS file_url text;
