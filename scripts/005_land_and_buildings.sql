-- Land parcels (1:1 with on-chain tokens)
CREATE TABLE IF NOT EXISTS public.land_parcels (
  parcel_id INTEGER PRIMARY KEY,
  token_id BIGINT,
  district_id TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 3,
  owner_wallet TEXT,
  status TEXT NOT NULL DEFAULT 'unminted',
  is_listed BOOLEAN NOT NULL DEFAULT FALSE,
  list_price_void NUMERIC(38,18),
  max_floors INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.land_parcels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "land_parcels_select_all"
  ON public.land_parcels FOR SELECT
  USING (true);

-- Buildings on parcels
CREATE TABLE IF NOT EXISTS public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id INTEGER NOT NULL REFERENCES public.land_parcels(parcel_id) ON DELETE CASCADE,
  owner_profile_id UUID REFERENCES public.profiles(id),
  operator_profile_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  building_type TEXT NOT NULL,
  floors INTEGER NOT NULL DEFAULT 1,
  style_preset TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "buildings_select_all"
  ON public.buildings FOR SELECT
  USING (true);

CREATE POLICY "buildings_update_owners"
  ON public.buildings FOR INSERT, UPDATE
  USING (
    auth.uid() = owner_profile_id
    OR auth.uid() = operator_profile_id
  )
  WITH CHECK (
    auth.uid() = owner_profile_id
    OR auth.uid() = operator_profile_id
  );

-- Units within buildings
CREATE TABLE IF NOT EXISTS public.building_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  floor INTEGER NOT NULL,
  unit_number TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  owner_profile_id UUID REFERENCES public.profiles(id),
  current_renter_profile_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'vacant',
  base_area NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(building_id, floor, unit_number)
);

ALTER TABLE public.building_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "units_select_all"
  ON public.building_units FOR SELECT
  USING (true);

-- Property listings (marketplace)
CREATE TABLE IF NOT EXISTS public.property_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type TEXT NOT NULL,
  parcel_id INTEGER REFERENCES public.land_parcels(parcel_id),
  unit_id UUID REFERENCES public.building_units(id),
  seller_wallet TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  price_void NUMERIC(38,18) NOT NULL,
  duration_days INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (asset_type = 'parcel' AND parcel_id IS NOT NULL AND unit_id IS NULL)
    OR (asset_type = 'unit' AND unit_id IS NOT NULL AND parcel_id IS NULL)
  )
);

ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "listings_select_all"
  ON public.property_listings FOR SELECT
  USING (true);

-- Leases (for rentals)
CREATE TABLE IF NOT EXISTS public.property_leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.property_listings(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL,
  parcel_id INTEGER,
  unit_id UUID,
  owner_wallet TEXT NOT NULL,
  renter_wallet TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_void NUMERIC(38,18) NOT NULL,
  paid_until DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.property_leases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leases_select_all"
  ON public.property_leases FOR SELECT
  USING (true);

-- Transaction history
CREATE TABLE IF NOT EXISTS public.property_transactions (
  id BIGSERIAL PRIMARY KEY,
  asset_type TEXT NOT NULL,
  parcel_id INTEGER,
  unit_id UUID,
  tx_hash TEXT,
  buyer_wallet TEXT,
  seller_wallet TEXT,
  price_void NUMERIC(38,18),
  event_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.property_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tx_select_all"
  ON public.property_transactions FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS property_tx_created_idx ON public.property_transactions(created_at DESC);
