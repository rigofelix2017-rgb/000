-- Enhanced real estate tracking with full lifecycle management

-- Property views/visits tracking
CREATE TABLE IF NOT EXISTS public.property_views (
  id BIGSERIAL PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  viewer_wallet TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  view_duration_seconds INTEGER
);

CREATE INDEX IF NOT EXISTS property_views_property_idx ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS property_views_viewer_idx ON public.property_views(viewer_wallet);
CREATE INDEX IF NOT EXISTS property_views_date_idx ON public.property_views(viewed_at DESC);

ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_views_select_all"
  ON public.property_views FOR SELECT
  USING (true);

CREATE POLICY "property_views_insert_own"
  ON public.property_views FOR INSERT
  WITH CHECK (true);

-- Property appraisal history
CREATE TABLE IF NOT EXISTS public.property_appraisals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  appraised_value NUMERIC(38,18) NOT NULL,
  appraiser_wallet TEXT,
  appraisal_method TEXT NOT NULL, -- 'automated' | 'manual' | 'market'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS property_appraisals_property_idx ON public.property_appraisals(property_id);
CREATE INDEX IF NOT EXISTS property_appraisals_date_idx ON public.property_appraisals(created_at DESC);

ALTER TABLE public.property_appraisals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_appraisals_select_all"
  ON public.property_appraisals FOR SELECT
  USING (true);

-- Property events (full lifecycle)
CREATE TABLE IF NOT EXISTS public.property_lifecycle_events (
  id BIGSERIAL PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'minted' | 'listed' | 'unlisted' | 'sold' | 'rented' | 'tax_paid' | 'upgraded' | 'demolished'
  actor_wallet TEXT NOT NULL,
  from_wallet TEXT,
  to_wallet TEXT,
  amount NUMERIC(38,18),
  metadata JSONB DEFAULT '{}'::jsonb,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS property_events_property_idx ON public.property_lifecycle_events(property_id);
CREATE INDEX IF NOT EXISTS property_events_type_idx ON public.property_lifecycle_events(event_type);
CREATE INDEX IF NOT EXISTS property_events_date_idx ON public.property_lifecycle_events(created_at DESC);

ALTER TABLE public.property_lifecycle_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_events_select_all"
  ON public.property_lifecycle_events FOR SELECT
  USING (true);

CREATE POLICY "property_events_insert_authenticated"
  ON public.property_lifecycle_events FOR INSERT
  WITH CHECK (true);

-- Map sector analytics (track which areas are most active)
CREATE TABLE IF NOT EXISTS public.map_sector_analytics (
  id BIGSERIAL PRIMARY KEY,
  sector_id TEXT NOT NULL, -- e.g. 'social_center', 'defi_west', 'gaming_east'
  district_id TEXT NOT NULL,
  player_visits INTEGER DEFAULT 0,
  total_dwell_time_seconds BIGINT DEFAULT 0,
  property_transactions INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(sector_id, date)
);

CREATE INDEX IF NOT EXISTS map_sector_analytics_sector_idx ON public.map_sector_analytics(sector_id);
CREATE INDEX IF NOT EXISTS map_sector_analytics_date_idx ON public.map_sector_analytics(date DESC);

ALTER TABLE public.map_sector_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "map_sector_analytics_select_all"
  ON public.map_sector_analytics FOR SELECT
  USING (true);

-- Function to update map analytics
CREATE OR REPLACE FUNCTION update_map_sector_analytics(
  p_sector_id TEXT,
  p_district_id TEXT,
  p_dwell_time INTEGER DEFAULT 0
) RETURNS void AS $$
BEGIN
  INSERT INTO public.map_sector_analytics (sector_id, district_id, player_visits, total_dwell_time_seconds, last_activity_at)
  VALUES (p_sector_id, p_district_id, 1, p_dwell_time, NOW())
  ON CONFLICT (sector_id, date)
  DO UPDATE SET
    player_visits = map_sector_analytics.player_visits + 1,
    total_dwell_time_seconds = map_sector_analytics.total_dwell_time_seconds + p_dwell_time,
    last_activity_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION update_map_sector_analytics TO authenticated;
