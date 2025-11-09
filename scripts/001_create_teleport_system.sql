-- Create teleport history table
CREATE TABLE IF NOT EXISTS teleport_history (
  id BIGSERIAL PRIMARY KEY,
  user_address TEXT NOT NULL,
  from_district TEXT,
  to_district TEXT NOT NULL,
  teleport_type TEXT NOT NULL CHECK (teleport_type IN ('instant', 'cab')),
  void_cost INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teleport_user_date ON teleport_history(user_address, created_at);

-- Function to check daily teleport limit (20 per day)
CREATE OR REPLACE FUNCTION check_teleport_limit(user_addr TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  daily_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO daily_count
  FROM teleport_history
  WHERE user_address = user_addr
    AND created_at >= NOW() - INTERVAL '24 hours';
  
  RETURN daily_count < 20;
END;
$$ LANGUAGE plpgsql;
