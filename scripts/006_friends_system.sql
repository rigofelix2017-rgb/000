-- Friends/social graph
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  CHECK (requester_id != addressee_id)
);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "friends_select_own"
  ON public.friends FOR SELECT
  USING (auth.uid() IN (requester_id, addressee_id));

CREATE POLICY "friends_insert_self"
  ON public.friends FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "friends_update_self"
  ON public.friends FOR UPDATE
  USING (auth.uid() IN (requester_id, addressee_id))
  WITH CHECK (auth.uid() IN (requester_id, addressee_id));

CREATE UNIQUE INDEX IF NOT EXISTS friends_pair_idx
  ON public.friends (LEAST(requester_id, addressee_id), GREATEST(requester_id, addressee_id));
