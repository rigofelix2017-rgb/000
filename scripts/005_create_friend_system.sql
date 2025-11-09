-- Friend System Tables
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  friend_wallet TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
  initiated_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_wallet, friend_wallet)
);

CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_wallet TEXT NOT NULL,
  to_wallet TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(from_wallet, to_wallet)
);

CREATE TABLE IF NOT EXISTS player_presence (
  wallet_address TEXT PRIMARY KEY,
  username TEXT,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'in-game', 'away')),
  location_x FLOAT,
  location_z FLOAT,
  current_district TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_wallet);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_wallet);
CREATE INDEX IF NOT EXISTS idx_friend_requests_to ON friend_requests(to_wallet, status);
CREATE INDEX IF NOT EXISTS idx_player_presence_status ON player_presence(status);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER friendships_update_timestamp
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER player_presence_update_timestamp
  BEFORE UPDATE ON player_presence
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Row Level Security (RLS) Policies
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_presence ENABLE ROW LEVEL SECURITY;

-- Users can view their own friendships
CREATE POLICY "Users can view own friendships" ON friendships
  FOR SELECT
  USING (user_wallet = current_setting('request.jwt.claims', true)::json->>'wallet' 
    OR friend_wallet = current_setting('request.jwt.claims', true)::json->>'wallet');

-- Users can create friend requests
CREATE POLICY "Users can send friend requests" ON friend_requests
  FOR INSERT
  WITH CHECK (from_wallet = current_setting('request.jwt.claims', true)::json->>'wallet');

-- Users can view requests sent to them
CREATE POLICY "Users can view friend requests" ON friend_requests
  FOR SELECT
  USING (to_wallet = current_setting('request.jwt.claims', true)::json->>'wallet'
    OR from_wallet = current_setting('request.jwt.claims', true)::json->>'wallet');

-- Users can update their own presence
CREATE POLICY "Users can update own presence" ON player_presence
  FOR ALL
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet');

-- Everyone can view online players
CREATE POLICY "Anyone can view online players" ON player_presence
  FOR SELECT
  USING (true);
