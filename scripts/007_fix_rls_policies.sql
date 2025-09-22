-- Fix infinite recursion in RLS policies by dropping and recreating them

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Only owners can manage users" ON user_profiles;

-- Allow authenticated users to read all profiles
CREATE POLICY "Authenticated users can read profiles" ON user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to insert their own profile (needed for initial profile creation)
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to manage all profiles (for admin operations)
CREATE POLICY "Service role can manage all profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');
