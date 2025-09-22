-- Insert the first owner user (you'll need to replace with your actual user ID after signup)
-- This is a placeholder - you'll need to update this with your actual auth.users ID
INSERT INTO user_profiles (id, email, role) 
VALUES (
  -- Replace this with your actual user ID from auth.users table
  '00000000-0000-0000-0000-000000000000',
  'hussein@example.com',
  'owner'
) ON CONFLICT (id) DO UPDATE SET role = 'owner';

-- Note: After you create your first user through Supabase auth,
-- you'll need to update this script with your actual user ID
