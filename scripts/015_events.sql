-- Events
-- Events are scheduled activities at venues (launches, concerts, AMAs, parties)

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES public.event_venues(id) ON DELETE CASCADE,
  organizer_profile_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  max_attendees INTEGER,            -- <= venue.capacity
  ticket_price_void NUMERIC(38,18) DEFAULT 0,
  is_onchain_ticket BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled' | 'live' | 'ended' | 'cancelled'
  tags TEXT[],
  metadata JSONB,                   -- custom event data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_all"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "events_insert_organizer"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_profile_id);

CREATE POLICY "events_update_organizer"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_profile_id)
  WITH CHECK (auth.uid() = organizer_profile_id);

CREATE INDEX idx_events_venue ON public.events(venue_id);
CREATE INDEX idx_events_organizer ON public.events(organizer_profile_id);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_status ON public.events(status);
