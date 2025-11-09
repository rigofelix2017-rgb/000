-- Player profiles for game-specific data
CREATE TABLE IF NOT EXISTS public.player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT,
  handle TEXT UNIQUE,
  avatar_url TEXT,
  spawn_preference JSONB,
  agency_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_profiles_select_own"
  ON public.player_profiles FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "player_profiles_insert_own"
  ON public.player_profiles FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "player_profiles_update_own"
  ON public.player_profiles FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS player_profiles_handle_idx ON public.player_profiles(handle);

CREATE TRIGGER player_profiles_updated_at
  BEFORE UPDATE ON public.player_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
