-- SKUs & Storefronts
-- In-world commerce: shops in buildings selling products/services

CREATE TABLE IF NOT EXISTS public.skus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,          -- 'VOID_HOODIE', 'AGENCY_PASS', 'EVENT_TICKET'
  name TEXT NOT NULL,
  description TEXT,
  price_void NUMERIC(38,18) NOT NULL,
  price_usd NUMERIC(10,2),
  max_supply BIGINT,
  sold_count BIGINT NOT NULL DEFAULT 0,
  sku_type TEXT NOT NULL DEFAULT 'physical', -- 'physical' | 'digital' | 'service' | 'access'
  metadata JSONB,                     -- images, attributes, fulfillment details
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sku_storefronts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id),
  display_name TEXT NOT NULL,
  description TEXT,
  layout_config JSONB,              -- 3D placement, UI theme, etc
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sku_storefronts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "storefronts_select_all"
  ON public.sku_storefronts FOR SELECT
  USING (true);

CREATE POLICY "storefronts_insert_building_owner"
  ON public.sku_storefronts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.buildings b
      WHERE b.id = building_id
      AND (b.owner_profile_id = auth.uid() OR b.operator_profile_id = auth.uid())
    )
  );

CREATE TABLE IF NOT EXISTS public.sku_storefront_items (
  storefront_id UUID NOT NULL REFERENCES public.sku_storefronts(id) ON DELETE CASCADE,
  sku_id UUID NOT NULL REFERENCES public.skus(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (storefront_id, sku_id)
);

CREATE INDEX idx_sku_storefronts_building ON public.sku_storefronts(building_id);
CREATE INDEX idx_sku_storefronts_agency ON public.sku_storefronts(agency_id);
