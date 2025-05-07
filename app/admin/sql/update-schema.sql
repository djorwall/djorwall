-- Add admin role to the existing users table
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- Create an admin user
INSERT INTO users (id, email, password, full_name, role, created_at, updated_at)
VALUES (
  'admin1111-1111-1111-1111-111111111111',
  'admin@influencerplatform.com',
  'securepassword123',
  'System Administrator',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
