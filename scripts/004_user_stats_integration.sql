-- User stats and XP tracking integrated with wallet addresses
-- This ensures all player data is tied to their on-chain identity

-- Add wallet_address to player_xp if not exists (should already exist based on schema)
-- Ensure player_xp properly tracks user progression

-- Create function to sync user profile with XP
CREATE OR REPLACE FUNCTION sync_user_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new profile is created, initialize their XP record
  INSERT INTO player_xp (
    profile_id,
    wallet_address,
    total_xp,
    explorer_xp,
    builder_xp,
    operator_xp,
    level,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.wallet_address,
    0,
    0,
    0,
    0,
    1,
    NOW(),
    NOW()
  )
  ON CONFLICT (profile_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create XP record when profile is created
DROP TRIGGER IF EXISTS trigger_sync_user_xp ON profiles;
CREATE TRIGGER trigger_sync_user_xp
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_xp();

-- Function to award XP and update levels
CREATE OR REPLACE FUNCTION award_xp(
  p_wallet_address TEXT,
  p_track TEXT, -- 'explorer', 'builder', 'operator', or 'all'
  p_amount INTEGER
)
RETURNS player_xp AS $$
DECLARE
  v_player_xp player_xp;
  v_new_level INTEGER;
BEGIN
  -- Update XP based on track
  UPDATE player_xp
  SET
    total_xp = total_xp + p_amount,
    explorer_xp = CASE WHEN p_track = 'explorer' OR p_track = 'all' THEN explorer_xp + p_amount ELSE explorer_xp END,
    builder_xp = CASE WHEN p_track = 'builder' OR p_track = 'all' THEN builder_xp + p_amount ELSE builder_xp END,
    operator_xp = CASE WHEN p_track = 'operator' OR p_track = 'all' THEN operator_xp + p_amount ELSE operator_xp END,
    updated_at = NOW()
  WHERE wallet_address = p_wallet_address
  RETURNING * INTO v_player_xp;

  -- Calculate new level (every 1000 XP = 1 level)
  v_new_level := FLOOR(v_player_xp.total_xp / 1000) + 1;

  -- Update level if changed
  IF v_new_level != v_player_xp.level THEN
    UPDATE player_xp
    SET level = v_new_level, updated_at = NOW()
    WHERE wallet_address = p_wallet_address
    RETURNING * INTO v_player_xp;
  END IF;

  RETURN v_player_xp;
END;
$$ LANGUAGE plpgsql;

-- Add index for faster wallet lookups
CREATE INDEX IF NOT EXISTS idx_player_xp_wallet ON player_xp(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet_address);
