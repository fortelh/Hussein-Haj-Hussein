-- Direct insert of owner profile bypassing RLS policies
-- Insert owner profile directly using service role to bypass RLS
INSERT INTO user_profiles (id, email, role, created_at, updated_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'hussein.hajj-hussein@hotmail.com' LIMIT 1),
  'hussein.hajj-hussein@hotmail.com',
  'owner',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'owner',
  updated_at = NOW();
