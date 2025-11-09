-- Property system for 4444 parcels across districts
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties table (4444 total parcels)
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id INTEGER UNIQUE NOT NULL,
  district_id TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('residential', 'commercial', 'special')),
  
  -- Location
  center_x DECIMAL(10, 2) NOT NULL,
  center_z DECIMAL(10, 2) NOT NULL,
  size_x INTEGER NOT NULL DEFAULT 20,
  size_z INTEGER NOT NULL DEFAULT 20,
  
  -- Ownership
  owner_address TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  
  -- Pricing
  base_price DECIMAL(20, 2) NOT NULL,
  current_price DECIMAL(20, 2) NOT NULL,
  price_multiplier DECIMAL(5, 2) NOT NULL DEFAULT 1.0,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'owned', 'pending', 'inactive')),
  for_sale BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Property tax
  last_tax_payment TIMESTAMP WITH TIME ZONE,
  tax_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.01,
  
  CONSTRAINT valid_coordinates CHECK (
    center_x >= -2000 AND center_x <= 2000 AND
    center_z >= -2000 AND center_z <= 2000
  )
);

-- Property activity log
CREATE TABLE IF NOT EXISTS property_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('purchase', 'sale', 'tax_payment', 'upgrade', 'transfer')),
  from_address TEXT,
  to_address TEXT,
  amount DECIMAL(20, 2),
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_address);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_for_sale ON properties(for_sale);
CREATE INDEX IF NOT EXISTS idx_property_activity_property ON property_activity(property_id);
CREATE INDEX IF NOT EXISTS idx_property_activity_address ON property_activity(to_address);

-- RLS Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_activity ENABLE ROW LEVEL SECURITY;

-- Everyone can view properties
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

-- Only authenticated users can view activity
CREATE POLICY "Property activity viewable by authenticated users"
  ON property_activity FOR SELECT
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_timestamp
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_property_timestamp();
