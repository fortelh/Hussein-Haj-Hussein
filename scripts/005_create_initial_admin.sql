-- Create an initial admin user for login
-- This creates a user in Supabase auth and adds them to our user_profiles table

-- First, we need to create the user in Supabase auth system
-- You'll need to run this manually in your Supabase SQL editor or use the Supabase dashboard

-- For now, let's create a user profile entry that will be linked when you create the auth user
INSERT INTO user_profiles (id, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@hussein-portfolio.com', -- Change this to your preferred email
  'owner',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Note: You'll need to create the actual auth user through Supabase dashboard
-- Go to Authentication > Users in your Supabase dashboard and create a user with:
-- Email: admin@hussein-portfolio.com (or your preferred email)
-- Password: your preferred password
-- Then update the user_profiles table to link the auth user ID
