-- Master task templates
CREATE TABLE IF NOT EXISTS public.daily_task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  track TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  target_value INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_task_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_task_templates_select_all"
  ON public.daily_task_templates FOR SELECT
  USING (true);

-- Player daily task instances
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.daily_task_templates(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  progress_value INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  claimed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (profile_id, template_id, date)
);

ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_tasks_select_own"
  ON public.daily_tasks FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "daily_tasks_update_own"
  ON public.daily_tasks FOR INSERT, UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX IF NOT EXISTS daily_tasks_profile_date_idx ON public.daily_tasks(profile_id, date);

-- Seed task templates
INSERT INTO public.daily_task_templates (code, title, description, track, xp_reward, target_value)
VALUES
  ('visit_3_zones', 'District Explorer', 'Visit 3 different zones today', 'explorer', 60, 3),
  ('walk_500m', 'Steps in the VOID', 'Walk 500m in the city', 'explorer', 40, 500),
  ('trade_once', 'VOID Trader', 'Complete 1 trade in Signals or DEX', 'operator', 50, 1),
  ('edit_agency', 'Agency Architect', 'Update your Agency HQ layout', 'builder', 60, 1),
  ('host_event', 'Host in the VOID', 'Host or attend 1 live event', 'builder', 80, 1)
ON CONFLICT (code) DO NOTHING;

CREATE TRIGGER daily_tasks_updated_at
  BEFORE UPDATE ON public.daily_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
