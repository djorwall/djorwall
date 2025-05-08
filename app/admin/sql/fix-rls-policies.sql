-- Enable RLS on all tables (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

DROP POLICY IF EXISTS "Agents can view their own profiles" ON agent_profiles;
DROP POLICY IF EXISTS "Agents can insert their own profiles" ON agent_profiles;
DROP POLICY IF EXISTS "Service role can manage all agent profiles" ON agent_profiles;

DROP POLICY IF EXISTS "Brands can view their own profiles" ON brand_profiles;
DROP POLICY IF EXISTS "Brands can insert their own profiles" ON brand_profiles;
DROP POLICY IF EXISTS "Service role can manage all brand profiles" ON brand_profiles;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can manage all users"
  ON users
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policies for agent_profiles table
CREATE POLICY "Agents can view their own profiles"
  ON agent_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Agents can insert their own profiles"
  ON agent_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all agent profiles"
  ON agent_profiles
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policies for brand_profiles table
CREATE POLICY "Brands can view their own profiles"
  ON brand_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Brands can insert their own profiles"
  ON brand_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all brand profiles"
  ON brand_profiles
  USING (auth.jwt() ->> 'role' = 'service_role');
