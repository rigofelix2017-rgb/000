-- Event Tickets
-- Tickets for event entry (can be free or paid, on-chain or off-chain)

CREATE TABLE IF NOT EXISTS public.event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT,
  sku_id UUID,                        -- optional link to SKU system
  status TEXT NOT NULL DEFAULT 'valid', -- 'valid' | 'used' | 'refunded' | 'transferred'
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tickets_select_own"
  ON public.event_tickets FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "tickets_insert_own"
  ON public.event_tickets FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX idx_event_tickets_event ON public.event_tickets(event_id);
CREATE INDEX idx_event_tickets_profile ON public.event_tickets(profile_id);
CREATE INDEX idx_event_tickets_status ON public.event_tickets(status);
