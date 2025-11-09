-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('founder', 'governance_member', 'user');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  -- Added wallet and Privy integration fields
  wallet_address TEXT,
  privy_user_id TEXT,
  base_chain_preference TEXT DEFAULT 'base-mainnet',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Everyone can view all profiles (for governance transparency)
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile (but not their role)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only founders can update any profile's role
CREATE POLICY "profiles_update_role_founders_only"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'founder'
    )
  );

-- Added indexes for wallet linking
CREATE UNIQUE INDEX IF NOT EXISTS profiles_wallet_address_idx
  ON public.profiles (lower(wallet_address));

CREATE INDEX IF NOT EXISTS profiles_privy_user_id_idx
  ON public.profiles (privy_user_id);

-- Added trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
