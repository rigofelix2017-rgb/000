-- Extend profiles table to link wallet + Supabase auth
CREATE TYPE user_role AS ENUM ('founder', 'governance_member', 'user');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  wallet_address TEXT,
  privy_user_id TEXT,
  base_chain_preference TEXT DEFAULT 'base-mainnet',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR INSERT, UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_wallet_address_idx
  ON public.profiles (lower(wallet_address));

CREATE INDEX IF NOT EXISTS profiles_privy_user_id_idx
  ON public.profiles (privy_user_id);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
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
