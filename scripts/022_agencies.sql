-- Agencies
-- Teams/organizations that can own land, run businesses, and earn XP together

CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,        -- 'void-labs', 'psx-agency'
  owner_profile_id UUID NOT NULL REFERENCES public.profiles(id),
  wallet_address TEXT,              -- agency treasury wallet
  logo_url TEXT,
  bio TEXT,
  website TEXT,
  twitter TEXT,
  discord TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agencies_select_all"
  ON public.agencies FOR SELECT
  USING (true);

CREATE POLICY "agencies_insert_own"
  ON public.agencies FOR INSERT
  WITH CHECK (auth.uid() = owner_profile_id);

CREATE POLICY "agencies_update_owner"
  ON public.agencies FOR UPDATE
  USING (auth.uid() = owner_profile_id);

CREATE TABLE IF NOT EXISTS public.agency_members (
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,             -- 'owner' | 'admin' | 'operator' | 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (agency_id, profile_id)
);

ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_members_select_self_or_member"
  ON public.agency_members FOR SELECT
  USING (
    auth.uid() = profile_id
    OR EXISTS (
      SELECT 1 FROM public.agency_members am
      WHERE am.agency_id = agency_members.agency_id
      AND am.profile_id = auth.uid()
    )
  );

CREATE POLICY "agency_members_insert_admin"
  ON public.agency_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agency_members am
      WHERE am.agency_id = agency_members.agency_id
      AND am.profile_id = auth.uid()
      AND am.role IN ('owner', 'admin')
    )
  );

CREATE INDEX idx_agency_members_profile ON public.agency_members(profile_id);
CREATE INDEX idx_agency_members_agency ON public.agency_members(agency_id);

-- Add agency ownership columns to land and buildings
ALTER TABLE public.land_parcels
  ADD COLUMN IF NOT EXISTS owning_agency_id UUID REFERENCES public.agencies(id);

ALTER TABLE public.buildings
  ADD COLUMN IF NOT EXISTS owning_agency_id UUID REFERENCES public.agencies(id);

-- Agency XP tracking
CREATE TABLE IF NOT EXISTS public.agency_xp (
  agency_id UUID PRIMARY KEY REFERENCES public.agencies(id) ON DELETE CASCADE,
  total_xp BIGINT NOT NULL DEFAULT 0,
  builder_xp BIGINT NOT NULL DEFAULT 0,
  operator_xp BIGINT NOT NULL DEFAULT 0,
  explorer_xp BIGINT NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agency_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_xp_select_members"
  ON public.agency_xp FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agency_members am
      WHERE am.agency_id = agency_xp.agency_id
      AND am.profile_id = auth.uid()
    )
  );

-- Function to grant XP to agencies
CREATE OR REPLACE FUNCTION public.grant_agency_xp(
  p_agency_id UUID,
  p_track TEXT,
  p_amount INTEGER,
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_row public.agency_xp%ROWTYPE;
  v_new_total BIGINT;
  v_new_level INTEGER;
BEGIN
  IF p_amount <= 0 OR p_agency_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.agency_xp (agency_id)
  VALUES (p_agency_id)
  ON CONFLICT (agency_id) DO NOTHING;

  SELECT * INTO v_row
  FROM public.agency_xp
  WHERE agency_id = p_agency_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF p_track = 'explorer' THEN
    v_row.explorer_xp := v_row.explorer_xp + p_amount;
  ELSIF p_track = 'builder' THEN
    v_row.builder_xp := v_row.builder_xp + p_amount;
  ELSE
    v_row.operator_xp := v_row.operator_xp + p_amount;
  END IF;

  v_new_total := v_row.total_xp + p_amount;
  v_row.total_xp := v_new_total;

  -- Slower leveling curve for agencies
  v_new_level := GREATEST(1, FLOOR(SQRT(v_new_total::numeric / 300)));

  UPDATE public.agency_xp
  SET total_xp = v_row.total_xp,
      explorer_xp = v_row.explorer_xp,
      builder_xp = v_row.builder_xp,
      operator_xp = v_row.operator_xp,
      level = v_new_level,
      updated_at = NOW()
  WHERE agency_id = p_agency_id;
END;
$$;
