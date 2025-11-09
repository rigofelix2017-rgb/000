-- Core XP tracking per player
CREATE TABLE IF NOT EXISTS public.player_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT,
  total_xp BIGINT NOT NULL DEFAULT 0,
  explorer_xp BIGINT NOT NULL DEFAULT 0,
  builder_xp BIGINT NOT NULL DEFAULT 0,
  operator_xp BIGINT NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  last_daily_reset DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.player_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_xp_select_own"
  ON public.player_xp FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "player_xp_update_own"
  ON public.player_xp FOR INSERT, UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- XP event log for analytics
CREATE TABLE IF NOT EXISTS public.xp_events (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  track TEXT NOT NULL,
  amount INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "xp_events_select_own"
  ON public.xp_events FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "xp_events_insert_own"
  ON public.xp_events FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS xp_events_profile_idx ON public.xp_events(profile_id, created_at DESC);

-- Auto-update timestamp
CREATE TRIGGER player_xp_updated_at
  BEFORE UPDATE ON public.player_xp
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
