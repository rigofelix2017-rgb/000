-- NPCs positioned in the world
CREATE TABLE IF NOT EXISTS public.npcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  district_id TEXT NOT NULL,
  spawn_x NUMERIC(10,4) NOT NULL,
  spawn_y NUMERIC(10,4) NOT NULL,
  spawn_z NUMERIC(10,4) NOT NULL,
  avatar_type TEXT,
  dialogue JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.npcs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "npcs_select_all"
  ON public.npcs FOR SELECT
  USING (true);

-- Mission templates (NPC quests)
CREATE TABLE IF NOT EXISTS public.mission_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  track TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  void_reward NUMERIC(38,18) DEFAULT 0,
  giver_npc_code TEXT NOT NULL,
  is_repeatable BOOLEAN NOT NULL DEFAULT FALSE,
  prerequisites JSONB DEFAULT '{}'::jsonb,
  objective JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mission_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "missions_select_all"
  ON public.mission_templates FOR SELECT
  USING (true);

-- Player mission progress
CREATE TABLE IF NOT EXISTS public.player_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.mission_templates(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offered',
  progress JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, mission_id)
);

ALTER TABLE public.player_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_missions_select_own"
  ON public.player_missions FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "player_missions_update_own"
  ON public.player_missions FOR INSERT, UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Seed NPCs
INSERT INTO public.npcs (code, name, district_id, spawn_x, spawn_y, spawn_z, avatar_type, dialogue)
VALUES
  (
    'hq_mentor',
    'Astra',
    'spawn-zone',
    0.0, 0.0, -6.0,
    'mentor_psx',
    '[
      { "id": "intro_1", "text": "Welcome to PSX Agency HQ." },
      { "id": "intro_2", "text": "This city rewards the ones who build... and the ones who explore." },
      { "id": "offer_1", "text": "Ready to earn your first Agency XP?" }
    ]'::jsonb
  ),
  (
    'defi_guru',
    'Basis',
    'defi-district',
    -800.0, 0.0, 800.0,
    'defi_guru',
    '[
      { "id": "intro_1", "text": "Markets sleep. Liquidity doesn''t." },
      { "id": "intro_2", "text": "Route a trade through the VOID DEX and I''ll show you how operators level up." }
    ]'::jsonb
  ),
  (
    'grid_runner',
    'Neon Kid',
    'gaming-district',
    -800.0, 0.0, -800.0,
    'runner_psx',
    '[
      { "id": "intro_1", "text": "See those rings on the map?" },
      { "id": "intro_2", "text": "Tag them before the others do. Fast feet, fast XP." }
    ]'::jsonb
  )
ON CONFLICT (code) DO NOTHING;

-- Seed missions
INSERT INTO public.mission_templates (code, title, description, track, xp_reward, void_reward, giver_npc_code, is_repeatable, prerequisites, objective)
VALUES
  (
    'hq_intro_route',
    'Agency Orientation',
    'Visit PSX HQ, Commerce Central, and Signals Plaza to unlock your Agency profile.',
    'explorer',
    100,
    0,
    'hq_mentor',
    FALSE,
    '{ "min_level": 1 }',
    '{
      "type": "visit_landmarks",
      "landmarks": ["spawn-zone", "commercial-core", "high-volume-hub"],
      "count": 3
    }'
  ),
  (
    'defi_first_trade',
    'First VOID Trade',
    'Execute a swap using the VOID DEX from inside the city.',
    'operator',
    120,
    5,
    'defi_guru',
    TRUE,
    '{ "min_level": 2 }',
    '{
      "type": "defi_trade",
      "min_volume_void": 10
    }'
  ),
  (
    'runner_ring_sprint',
    'Ring Sprint',
    'Reach 5 different map rings without teleporting.',
    'explorer',
    140,
    0,
    'grid_runner',
    TRUE,
    '{ "min_level": 3 }',
    '{
      "type": "ring_sprint",
      "rings_required": 5,
      "time_limit_sec": 900
    }'
  )
ON CONFLICT (code) DO NOTHING;

CREATE TRIGGER player_missions_updated_at
  BEFORE UPDATE ON public.player_missions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
