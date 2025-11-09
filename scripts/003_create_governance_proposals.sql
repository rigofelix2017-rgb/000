-- Create governance proposals table
CREATE TABLE IF NOT EXISTS public.governance_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;

-- Everyone can view proposals
CREATE POLICY "proposals_select_all"
  ON public.governance_proposals FOR SELECT
  USING (true);

-- Only governance members and founders can create proposals
CREATE POLICY "proposals_insert_governance"
  ON public.governance_proposals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('founder', 'governance_member')
    )
  );

-- Proposal creators and founders can update their proposals
CREATE POLICY "proposals_update_own_or_founder"
  ON public.governance_proposals FOR UPDATE
  USING (
    proposed_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'founder'
    )
  );
