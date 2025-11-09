-- Event Attendance
-- Tracks who attended events and for how long (used for XP and analytics)

CREATE TABLE IF NOT EXISTS public.event_attendance (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL,
  left_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  xp_granted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_select_own"
  ON public.event_attendance FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "attendance_insert_own"
  ON public.event_attendance FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX idx_event_attendance_event ON public.event_attendance(event_id);
CREATE INDEX idx_event_attendance_profile ON public.event_attendance(profile_id);
CREATE INDEX idx_event_attendance_joined ON public.event_attendance(joined_at);
