-- Passport/Badge system for free movement
CREATE TABLE IF NOT EXISTS user_passports (
  id BIGSERIAL PRIMARY KEY,
  user_address TEXT NOT NULL UNIQUE,
  passport_tier INTEGER DEFAULT 1 CHECK (passport_tier IN (1, 2, 3)),
  is_founder BOOLEAN DEFAULT false,
  founder_nft_count INTEGER DEFAULT 0,
  
  -- Access permissions
  can_access_premium BOOLEAN DEFAULT false,
  can_access_glizzy_world BOOLEAN DEFAULT false,
  can_access_founder_district BOOLEAN DEFAULT false,
  
  -- Achievements and reputation
  reputation_score INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_passports_address ON user_passports(user_address);

-- District checkpoints
CREATE TABLE IF NOT EXISTS checkpoint_entries (
  id BIGSERIAL PRIMARY KEY,
  user_address TEXT NOT NULL,
  district_id TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('allowed', 'denied', 'requires-payment')),
  payment_amount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkpoint_entries_user ON checkpoint_entries(user_address, created_at);

-- Function to check district access
CREATE OR REPLACE FUNCTION check_district_access(
  user_addr TEXT,
  district TEXT
)
RETURNS JSONB AS $$
DECLARE
  passport_record RECORD;
  result JSONB;
BEGIN
  SELECT * INTO passport_record
  FROM user_passports
  WHERE user_address = user_addr;
  
  -- Default deny
  result := jsonb_build_object('allowed', false, 'reason', 'No passport found');
  
  IF NOT FOUND THEN
    RETURN result;
  END IF;
  
  -- Check district-specific permissions
  IF district = 'founders-exclusive' THEN
    IF passport_record.is_founder AND passport_record.founder_nft_count >= 5 THEN
      result := jsonb_build_object('allowed', true);
    ELSE
      result := jsonb_build_object('allowed', false, 'reason', 'Requires 5+ Founder NFTs');
    END IF;
  ELSIF district = 'glizzy-world' THEN
    IF passport_record.can_access_glizzy_world THEN
      result := jsonb_build_object('allowed', true);
    ELSE
      result := jsonb_build_object('allowed', false, 'reason', 'Requires 100k PSX');
    END IF;
  ELSE
    -- Public districts
    result := jsonb_build_object('allowed', true);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
