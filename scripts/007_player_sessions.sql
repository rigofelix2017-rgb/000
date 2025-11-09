-- Online presence tracking
CREATE TABLE IF NOT EXISTS public.player_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT,
  server_instance_id TEXT,
  district_id TEXT NOT NULL,
  x NUMERIC(10,4) NOT NULL DEFAULT 0,
  y NUMERIC(10,4) NOT NULL DEFAULT 0,
  z NUMERIC(10,4) NOT NULL DEFAULT 0,
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  last_heartbeat TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.player_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_all"
  ON public.player_sessions FOR SELECT
  USING (true);

CREATE POLICY "sessions_upsert_own"
  ON public.player_sessions FOR INSERT, UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS player_sessions_online_idx
  ON public.player_sessions (is_online, district_id);
