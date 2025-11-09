-- Enhanced property system with yards, business metrics, and teleport tracking
-- Adding customization, business tracking, and passport system

-- Property customization (yards, fences, decorations)
CREATE TABLE IF NOT EXISTS property_customization (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Yard customization
  front_yard_items JSONB DEFAULT '[]'::jsonb,
  back_yard_items JSONB DEFAULT '[]'::jsonb,
  fence_type TEXT NOT NULL DEFAULT 'white-picket' CHECK (fence_type IN ('white-picket', 'energy-barrier', 'none')),
  grass_texture TEXT NOT NULL DEFAULT 'standard',
  
  -- Building customization
  building_color TEXT,
  signage_text TEXT,
  exterior_sku_items JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(property_id)
);

-- Business metrics tracking
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  business_name TEXT,
  business_license_type TEXT CHECK (business_license_type IN ('retail', 'restaurant', 'entertainment', 'defi', 'creator-space', 'agency-service')),
  
  -- Performance metrics
  daily_visitors INTEGER DEFAULT 0,
  total_visitors INTEGER DEFAULT 0,
  transaction_volume DECIMAL(20, 2) DEFAULT 0,
  skus_sold INTEGER DEFAULT 0,
  customer_rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  days_in_business INTEGER DEFAULT 0,
  
  -- Business value
  business_value DECIMAL(20, 2) DEFAULT 0,
  acquisition_price DECIMAL(20, 2),
  is_for_acquisition BOOLEAN DEFAULT false,
  
  -- License info
  license_purchased_at TIMESTAMP WITH TIME ZONE,
  license_expires_at TIMESTAMP WITH TIME ZONE,
  license_auto_renew BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(property_id)
);

-- Daily business activity log
CREATE TABLE IF NOT EXISTS business_daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES business_metrics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  visitors INTEGER DEFAULT 0,
  transaction_volume DECIMAL(20, 2) DEFAULT 0,
  skus_sold INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(business_id, date)
);

-- Passport system
CREATE TABLE IF NOT EXISTS passports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_address TEXT UNIQUE NOT NULL,
  passport_tier TEXT NOT NULL DEFAULT 'basic' CHECK (passport_tier IN ('basic', 'founder', 'premium')),
  
  -- Access privileges
  can_access_all_districts BOOLEAN DEFAULT false,
  custom_checkpoints JSONB DEFAULT '[]'::jsonb,
  
  -- Passport info
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Stats
  properties_owned INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]'::jsonb,
  reputation_score INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teleport tracking
CREATE TABLE IF NOT EXISTS teleport_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  from_district TEXT,
  to_district TEXT NOT NULL,
  teleport_type TEXT NOT NULL CHECK (teleport_type IN ('instant', 'cab')),
  void_cost DECIMAL(10, 2) NOT NULL,
  teleport_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checkpoint system
CREATE TABLE IF NOT EXISTS district_checkpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id TEXT NOT NULL,
  checkpoint_type TEXT NOT NULL CHECK (checkpoint_type IN ('founder-only', 'psx-requirement', 'custom-creator')),
  requirement_type TEXT, -- 'nft-count', 'psx-balance', 'custom'
  requirement_value TEXT,
  creator_address TEXT, -- For custom creator checkpoints
  checkpoint_fee DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_business_metrics_property ON business_metrics(property_id);
CREATE INDEX IF NOT EXISTS idx_business_daily_stats_business ON business_daily_stats(business_id);
CREATE INDEX IF NOT EXISTS idx_business_daily_stats_date ON business_daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_passports_owner ON passports(owner_address);
CREATE INDEX IF NOT EXISTS idx_teleport_history_user ON teleport_history(user_address);
CREATE INDEX IF NOT EXISTS idx_teleport_history_date ON teleport_history(teleport_date);
CREATE INDEX IF NOT EXISTS idx_checkpoints_district ON district_checkpoints(district_id);

-- RLS Policies
ALTER TABLE property_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teleport_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customization viewable by everyone" ON property_customization FOR SELECT USING (true);
CREATE POLICY "Business metrics viewable by everyone" ON business_metrics FOR SELECT USING (true);
CREATE POLICY "Business stats viewable by everyone" ON business_daily_stats FOR SELECT USING (true);
CREATE POLICY "Passports viewable by everyone" ON passports FOR SELECT USING (true);
CREATE POLICY "Teleport history viewable by owner" ON teleport_history FOR SELECT USING (user_address = auth.jwt() ->> 'sub');
CREATE POLICY "Checkpoints viewable by everyone" ON district_checkpoints FOR SELECT USING (true);

-- Function to calculate daily teleport limit
CREATE OR REPLACE FUNCTION check_teleport_limit(user_addr TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  daily_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO daily_count
  FROM teleport_history
  WHERE user_address = user_addr
  AND teleport_date = CURRENT_DATE;
  
  RETURN daily_count < 20;
END;
$$ LANGUAGE plpgsql;

-- Function to update business metrics
CREATE OR REPLACE FUNCTION update_business_metrics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_metrics_timestamp
BEFORE UPDATE ON business_metrics
FOR EACH ROW
EXECUTE FUNCTION update_business_metrics_timestamp();
