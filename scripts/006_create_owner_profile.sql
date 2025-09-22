-- Create owner profile for the actual logged-in user
-- This will create an owner user profile for hussein.hajj-hussein@hotmail.com

INSERT INTO user_profiles (id, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'hussein.hajj-hussein@hotmail.com', -- Using your actual login email
  'owner', -- Setting role to owner so you can manage other users
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'owner', -- Ensure role is updated to owner if profile already exists
  updated_at = NOW();
