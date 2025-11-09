CREATE TABLE IF NOT EXISTS hook_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Hook identification
  hook_address TEXT UNIQUE NOT NULL,
  hook_name TEXT NOT NULL,
  hook_type TEXT NOT NULL, -- 'defi', 'gaming', 'social', 'nft', 'other'
  
  -- Owner/operator
  owner_wallet TEXT NOT NULL,
  
  -- Property mapping
  property_id UUID REFERENCES properties(id),
  coordinates_x REAL,
  coordinates_y REAL,
  coordinates_z REAL,
  district TEXT,
  
  -- Volume tracking for auto-whitelist
  total_volume BIGINT DEFAULT 0,
  last_30d_volume BIGINT DEFAULT 0,
  peak_daily_volume BIGINT DEFAULT 0,
  
  -- Status & approval
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'active', 'inactive', 'removed'
  approved_at TIMESTAMPTZ,
  approval_proposal_id UUID REFERENCES proposals(id),
  
  -- Auto-whitelist tracking
  whitelisted_for_signals BOOLEAN DEFAULT false,
  signals_nft_granted BOOLEAN DEFAULT false,
  whitelist_threshold_met_at TIMESTAMPTZ,
  
  -- Property tax
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  last_tax_payment_at TIMESTAMPTZ DEFAULT NOW(),
  tax_balance BIGINT DEFAULT 0, -- Negative = owed, positive = prepaid
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'active', 'inactive', 'removed')),
  CONSTRAINT valid_hook_type CHECK (hook_type IN ('defi', 'gaming', 'social', 'nft', 'entertainment', 'infrastructure', 'other'))
);

CREATE TABLE IF NOT EXISTS hook_volume_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hook_address TEXT NOT NULL REFERENCES hook_registry(hook_address) ON DELETE CASCADE,
  date DATE NOT NULL,
  daily_volume BIGINT NOT NULL,
  transaction_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT unique_hook_date UNIQUE (hook_address, date)
);

CREATE TABLE IF NOT EXISTS property_tax_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hook_address TEXT REFERENCES hook_registry(hook_address) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id),
  amount BIGINT NOT NULL,
  payment_period_start DATE NOT NULL,
  payment_period_end DATE NOT NULL,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  transaction_hash TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hooks_status ON hook_registry(status);
CREATE INDEX IF NOT EXISTS idx_hooks_owner ON hook_registry(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_hooks_district ON hook_registry(district);
CREATE INDEX IF NOT EXISTS idx_hooks_signals ON hook_registry(whitelisted_for_signals);
CREATE INDEX IF NOT EXISTS idx_volume_hook ON hook_volume_history(hook_address);
CREATE INDEX IF NOT EXISTS idx_volume_date ON hook_volume_history(date);
CREATE INDEX IF NOT EXISTS idx_tax_hook ON property_tax_payments(hook_address);

-- Enable RLS
ALTER TABLE hook_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_volume_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_tax_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view hooks" ON hook_registry FOR SELECT USING (true);
CREATE POLICY "Anyone can register hooks" ON hook_registry FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can update their hooks" ON hook_registry FOR UPDATE USING (owner_wallet = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Anyone can view volume" ON hook_volume_history FOR SELECT USING (true);
CREATE POLICY "Anyone can record volume" ON hook_volume_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view tax payments" ON property_tax_payments FOR SELECT USING (true);
CREATE POLICY "Anyone can make tax payments" ON property_tax_payments FOR INSERT WITH CHECK (true);
