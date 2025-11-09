-- Event Venues
-- Venues are buildings that can host events (concerts, conferences, product launches)

CREATE TABLE IF NOT EXISTS public.event_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  parcel_id INTEGER NOT NULL REFERENCES public.land_parcels(parcel_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 100,
  venue_type TEXT NOT NULL,          -- 'concert', 'conference', 'gallery', 'club', 'theater'
  config JSONB,                      -- lights, screens, seating, stage layout, etc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.event_venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_venues_select_all"
  ON public.event_venues FOR SELECT
  USING (true);

CREATE POLICY "event_venues_insert_building_owner"
  ON public.event_venues FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.buildings b
      WHERE b.id = building_id
      AND (b.owner_profile_id = auth.uid() OR b.operator_profile_id = auth.uid())
    )
  );

CREATE POLICY "event_venues_update_building_owner"
  ON public.event_venues FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.buildings b
      WHERE b.id = building_id
      AND (b.owner_profile_id = auth.uid() OR b.operator_profile_id = auth.uid())
    )
  );

CREATE INDEX idx_event_venues_building ON public.event_venues(building_id);
CREATE INDEX idx_event_venues_parcel ON public.event_venues(parcel_id);
