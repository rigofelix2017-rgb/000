-- Complete XP System Implementation
-- From XP-SYSTEM-IMPLEMENTATION.md

-- Player XP and levels
CREATE TABLE IF NOT EXISTS player_xp (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL UNIQUE,
  total_xp BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp_to_next_level BIGINT DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily tasks (reset every 24h)
CREATE TABLE IF NOT EXISTS daily_tasks (
  id SERIAL PRIMARY KEY,
  task_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL,
  category VARCHAR(50),
  requirement_type VARCHAR(50),
  requirement_value INTEGER,
  icon VARCHAR(100),
  sort_order INTEGER DEFAULT 0
);

-- Missions (one-time or repeatable)
CREATE TABLE IF NOT EXISTS missions (
  id SERIAL PRIMARY KEY,
  mission_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL,
  category VARCHAR(50),
  requirement_type VARCHAR(50),
  requirement_value INTEGER,
  is_repeatable BOOLEAN DEFAULT FALSE,
  repeat_interval VARCHAR(20),
  icon VARCHAR(100),
  sort_order INTEGER DEFAULT 0
);

-- Player task progress
CREATE TABLE IF NOT EXISTS player_task_progress (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  task_id VARCHAR(50) NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  reset_at TIMESTAMP,
  UNIQUE(wallet_address, task_id, reset_at)
);

-- Player mission progress
CREATE TABLE IF NOT EXISTS player_mission_progress (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  mission_id VARCHAR(50) NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  times_completed INTEGER DEFAULT 0,
  UNIQUE(wallet_address, mission_id)
);

-- XP transaction history
CREATE TABLE IF NOT EXISTS xp_transactions (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  amount INTEGER NOT NULL,
  source VARCHAR(50),
  source_id VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_xp_address ON player_xp(wallet_address);
CREATE INDEX IF NOT EXISTS idx_task_progress_address ON player_task_progress(wallet_address);
CREATE INDEX IF NOT EXISTS idx_mission_progress_address ON player_mission_progress(wallet_address);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_address ON xp_transactions(wallet_address);

-- Insert daily tasks
INSERT INTO daily_tasks (task_id, name, description, xp_reward, requirement_value, icon, sort_order) 
VALUES
  ('daily_login', 'Daily Login', 'Log in to VOID', 10, 1, '🎮', 1),
  ('daily_chat_10', 'Social Butterfly', 'Send 10 chat messages', 25, 10, '💬', 2),
  ('daily_tip_player', 'Generous Spirit', 'Tip another player', 50, 1, '💸', 3),
  ('daily_queue_song', 'DJ of the Day', 'Queue a song in the jukebox', 30, 1, '🎵', 4),
  ('daily_visit_house', 'House Hunter', 'Visit 3 different houses', 40, 3, '🏠', 5),
  ('daily_ring_blast', 'Ring Master', 'Use Ring Blast 5 times', 35, 5, '💫', 6),
  ('daily_playtime_30min', 'Dedicated Player', 'Play for 30 minutes', 60, 1800, '⏰', 7)
ON CONFLICT (task_id) DO NOTHING;

-- Insert missions
INSERT INTO missions (mission_id, name, description, xp_reward, icon, sort_order, is_repeatable)
VALUES
  ('first_tip', 'First Tip', 'Send your first tip', 100, '💰', 1, false),
  ('first_house', 'Home Owner', 'Purchase your first house', 200, '🏡', 2, false),
  ('first_land', 'Land Baron', 'Purchase your first land parcel', 500, '🗺️', 3, false),
  ('furniture_collector', 'Interior Designer', 'Own 10 different furniture pieces', 300, '🛋️', 4, false)
ON CONFLICT (mission_id) DO NOTHING;
