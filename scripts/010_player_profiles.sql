-- Player game profiles (in-world identity)
CREATE TABLE IF NOT EXISTS public.player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT,
  handle TEXT UNIQUE,
  avatar_url TEXT,
  spawn_preference JSONB DEFAULT '{"type": "hq", "parcelId": null}'::jsonb,
  agency_tier TEXT DEFAULT 'explorer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_profiles_select_own"
  ON public.player_profiles FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "player_profiles_upsert_own"
  ON public.player_profiles FOR INSERT, UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE TRIGGER player_profiles_updated_at
  BEFORE UPDATE ON public.player_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
