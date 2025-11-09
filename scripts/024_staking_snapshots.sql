-- Staking Snapshots
-- Cached xVOID staking data for XP multipliers and benefits

CREATE TABLE IF NOT EXISTS public.staking_snapshots (
  wallet_address TEXT PRIMARY KEY,
  xvoid_balance NUMERIC(38,18) NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'none',  -- 'none' | 'bronze' | 'silver' | 'gold' | 'diamond'
  multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_staking_snapshots_tier ON public.staking_snapshots(tier);

-- Function to calculate tier from balance
CREATE OR REPLACE FUNCTION public.calculate_staking_tier(balance NUMERIC)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF balance >= 100000 THEN RETURN 'diamond';
  ELSIF balance >= 50000 THEN RETURN 'gold';
  ELSIF balance >= 10000 THEN RETURN 'silver';
  ELSIF balance >= 1000 THEN RETURN 'bronze';
  ELSE RETURN 'none';
  END IF;
END;
$$;

-- Function to calculate multiplier from tier
CREATE OR REPLACE FUNCTION public.calculate_staking_multiplier(tier TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
  CASE tier
    WHEN 'diamond' THEN RETURN 1.5;
    WHEN 'gold' THEN RETURN 1.3;
    WHEN 'silver' THEN RETURN 1.15;
    WHEN 'bronze' THEN RETURN 1.05;
    ELSE RETURN 1.0;
  END CASE;
END;
$$;
