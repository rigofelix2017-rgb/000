-- Notifications
-- In-app notifications for friend requests, events, missions, etc

CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,              -- 'friend_request' | 'mission_completed' | 'event_starting' | 'achievement_unlocked' | 'message_received'
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,                      -- context data for the notification
  action_url TEXT,                 -- deep link or page to navigate to
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "notifications_insert_own"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE INDEX idx_notifications_profile ON public.notifications(profile_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(profile_id, is_read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);
