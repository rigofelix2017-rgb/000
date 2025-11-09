-- Business performance tracking
CREATE TABLE IF NOT EXISTS business_metrics (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_license TEXT NOT NULL CHECK (business_license IN ('retail', 'restaurant', 'entertainment', 'defi', 'creator-space')),
  
  -- Performance metrics
  daily_visitors INTEGER DEFAULT 0,
  total_visitors BIGINT DEFAULT 0,
  transaction_volume BIGINT DEFAULT 0, -- in VOID
  skus_sold INTEGER DEFAULT 0,
  customer_rating DECIMAL(3,2) DEFAULT 0.00 CHECK (customer_rating >= 0 AND customer_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  
  -- Business status
  is_active BOOLEAN DEFAULT true,
  days_active INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Acquisition
  is_for_sale BOOLEAN DEFAULT false,
  asking_price BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_business_metrics_property ON business_metrics(property_id);
CREATE INDEX idx_business_metrics_active ON business_metrics(is_active, is_for_sale);

-- Business transaction history
CREATE TABLE IF NOT EXISTS business_transactions (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES business_metrics(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'purchase', 'commission')),
  amount BIGINT NOT NULL,
  customer_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_business_transactions_business ON business_transactions(business_id, created_at);

-- Function to update business activity
CREATE OR REPLACE FUNCTION update_business_activity(bus_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE business_metrics
  SET last_activity_at = NOW(),
      updated_at = NOW()
  WHERE id = bus_id;
END;
$$ LANGUAGE plpgsql;
