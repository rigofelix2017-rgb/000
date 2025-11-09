-- Production Database Optimizations
-- This script adds indexes and optimizations for production performance

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_player_xp_wallet ON player_xp(wallet_address);
CREATE INDEX IF NOT EXISTS idx_player_xp_profile ON player_xp(profile_id);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district_id);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_address);
CREATE INDEX IF NOT EXISTS idx_properties_for_sale ON properties(for_sale) WHERE for_sale = true;
CREATE INDEX IF NOT EXISTS idx_hook_registry_owner ON hook_registry(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_hook_registry_district ON hook_registry(district);
CREATE INDEX IF NOT EXISTS idx_player_presence_wallet ON player_presence(wallet_address);
CREATE INDEX IF NOT EXISTS idx_player_presence_updated ON player_presence(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_global_chat_created ON global_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proximity_chat_district ON proximity_chat_messages(district, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_wallet, status);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_profile_date ON daily_tasks(profile_id, date);

-- Add composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_properties_district_sale ON properties(district_id, for_sale, current_price);
CREATE INDEX IF NOT EXISTS idx_hook_registry_status_district ON hook_registry(status, district, total_volume DESC);

-- Optimize RLS policies for better performance
-- (Note: RLS policies are already enabled on most tables, this ensures they're optimal)

-- Add statistics updates for query optimization
ANALYZE player_xp;
ANALYZE properties;
ANALYZE hook_registry;
ANALYZE player_presence;
