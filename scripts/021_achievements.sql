-- Achievements
-- Milestone rewards for player accomplishments

CREATE TABLE IF NOT EXISTS public.achievement_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,          -- 'own_10_parcels', 'host_10_events', 'first_mission'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  track TEXT,                         -- optional: 'explorer' | 'builder' | 'operator'
  icon TEXT,                          -- icon id / URL
  rarity TEXT NOT NULL DEFAULT 'common', -- 'common' | 'rare' | 'epic' | 'legendary'
  criteria JSONB NOT NULL,            -- rule definition: {"type": "parcel_count", "count": 10}
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.player_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_templates(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (profile_id, achievement_id)
);

ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_achievements_select_own"
  ON public.player_achievements FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "player_achievements_insert_own"
  ON public.player_achievements FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX idx_player_achievements_profile ON public.player_achievements(profile_id);

-- Seed some starter achievements
INSERT INTO public.achievement_templates (code, title, description, track, rarity, criteria, xp_reward)
VALUES
  ('first_login', 'Welcome to the VOID', 'Log in for the first time', 'explorer', 'common', '{"type": "login_count", "count": 1}'::jsonb, 100),
  ('own_first_parcel', 'Land Owner', 'Purchase your first parcel', 'builder', 'common', '{"type": "parcel_count", "count": 1}'::jsonb, 250),
  ('own_10_parcels', 'Property Mogul', 'Own 10 parcels', 'builder', 'rare', '{"type": "parcel_count", "count": 10}'::jsonb, 2500),
  ('first_mission', 'Mission Accepted', 'Complete your first NPC mission', 'explorer', 'common', '{"type": "mission_count", "count": 1}'::jsonb, 150),
  ('10_missions', 'Quest Master', 'Complete 10 missions', 'explorer', 'rare', '{"type": "mission_count", "count": 10}'::jsonb, 1500),
  ('host_first_event', 'Event Organizer', 'Host your first event', 'operator', 'common', '{"type": "event_hosted_count", "count": 1}'::jsonb, 300),
  ('attend_10_events', 'Social Butterfly', 'Attend 10 events', 'explorer', 'rare', '{"type": "event_attended_count", "count": 10}'::jsonb, 1000),
  ('first_friend', 'Making Connections', 'Add your first friend', 'explorer', 'common', '{"type": "friend_count", "count": 1}'::jsonb, 100),
  ('10_friends', 'Popular', 'Have 10 friends', 'explorer', 'rare', '{"type": "friend_count", "count": 10}'::jsonb, 1000)
ON CONFLICT (code) DO NOTHING;
