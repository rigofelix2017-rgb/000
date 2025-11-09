-- Create proposal votes table
CREATE TABLE IF NOT EXISTS public.proposal_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.governance_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote BOOLEAN NOT NULL, -- true = for, false = against
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

-- Enable RLS
ALTER TABLE public.proposal_votes ENABLE ROW LEVEL SECURITY;

-- Everyone can view votes
CREATE POLICY "votes_select_all"
  ON public.proposal_votes FOR SELECT
  USING (true);

-- Only governance members and founders can vote
CREATE POLICY "votes_insert_governance"
  ON public.proposal_votes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('founder', 'governance_member')
    ) AND user_id = auth.uid()
  );

-- Users can update their own votes
CREATE POLICY "votes_update_own"
  ON public.proposal_votes FOR UPDATE
  USING (user_id = auth.uid());
