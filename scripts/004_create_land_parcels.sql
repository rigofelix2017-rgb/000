-- Land parcels marketplace database
CREATE TABLE IF NOT EXISTS public.land_parcels (
  parcel_id INTEGER PRIMARY KEY,
  token_id BIGINT,
  district_id TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 3,
  owner_wallet TEXT,
  is_listed BOOLEAN NOT NULL DEFAULT FALSE,
  list_price_void NUMERIC(38, 18),
  status TEXT NOT NULL DEFAULT 'unminted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.land_parcels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "land_parcels_select_all"
  ON public.land_parcels FOR SELECT
  USING (true);

CREATE POLICY "land_parcels_update_owner"
  ON public.land_parcels FOR UPDATE
  USING (owner_wallet IS NULL OR owner_wallet = current_setting('request.jwt.claim.wallet_address', true))
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS land_parcels_district_idx ON public.land_parcels(district_id);
CREATE INDEX IF NOT EXISTS land_parcels_status_idx ON public.land_parcels(status);
CREATE INDEX IF NOT EXISTS land_parcels_owner_idx ON public.land_parcels(owner_wallet);

CREATE TRIGGER land_parcels_updated_at
  BEFORE UPDATE ON public.land_parcels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
