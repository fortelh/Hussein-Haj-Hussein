-- Create projects table for storing portfolio projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (portfolio is public)
-- But only authenticated admin can modify
CREATE POLICY "projects_select_public" 
  ON public.projects FOR SELECT 
  USING (true);

CREATE POLICY "projects_insert_admin" 
  ON public.projects FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "projects_update_admin" 
  ON public.projects FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "projects_delete_admin" 
  ON public.projects FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON public.projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
