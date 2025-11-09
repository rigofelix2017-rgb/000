-- Spawn ring metadata (for spawning near landmarks)
CREATE TABLE IF NOT EXISTS public.spawn_rings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landmark_code TEXT NOT NULL,
  district_id TEXT NOT NULL,
  center_x NUMERIC(10,4) NOT NULL,
  center_y NUMERIC(10,4) NOT NULL,
  center_z NUMERIC(10,4) NOT NULL,
  inner_radius NUMERIC(10,4) NOT NULL,
  outer_radius NUMERIC(10,4) NOT NULL,
  max_players INTEGER DEFAULT 20
);

ALTER TABLE public.spawn_rings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spawn_rings_select_all"
  ON public.spawn_rings FOR SELECT
  USING (true);

-- Seed HQ spawn ring
INSERT INTO public.spawn_rings (landmark_code, district_id, center_x, center_y, center_z, inner_radius, outer_radius, max_players)
VALUES
  ('psx-hq', 'spawn-zone', 0.0, 0.0, -6.0, 3.0, 8.0, 50),
  ('commerce-ring', 'commercial-core', 400.0, 0.0, 0.0, 5.0, 12.0, 30),
  ('signals-ring', 'high-volume-hub', -400.0, 0.0, 0.0, 5.0, 12.0, 30),
  ('gaming-ring', 'gaming-district', -800.0, 0.0, -800.0, 5.0, 15.0, 40),
  ('defi-ring', 'defi-district', -800.0, 0.0, 800.0, 5.0, 15.0, 40)
ON CONFLICT DO NOTHING;
