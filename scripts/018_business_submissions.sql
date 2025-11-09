-- Business Submissions
-- Applications from businesses/projects wanting to build in the VOID

CREATE TABLE IF NOT EXISTS public.business_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submitter_wallet TEXT,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,        -- 'defi' | 'gaming' | 'social' | 'art' | 'infra' | 'commerce'
  description TEXT,
  website TEXT,
  twitter TEXT,
  discord TEXT,
  hook_address TEXT,                  -- for Uniswap v4 hooks, etc
  estimated_volume_usd NUMERIC(38,2),
  requesting_agency_support BOOLEAN DEFAULT FALSE,
  agency_services TEXT[],             -- '{dev,marketing,liquidity,design}'
  preferred_district_id TEXT,
  requested_parcel_count INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'under_review' | 'approved' | 'rejected' | 'deployed'
  submission_fee_void NUMERIC(38,18),
  submission_tx_hash TEXT,            -- on-chain payment proof
  proposal_url TEXT,                  -- link to governance proposal (Snapshot, Tally, etc)
  review_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "biz_submissions_select_own"
  ON public.business_submissions FOR SELECT
  USING (auth.uid() = submitter_profile_id);

CREATE POLICY "biz_submissions_insert_self"
  ON public.business_submissions FOR INSERT
  WITH CHECK (auth.uid() = submitter_profile_id);

-- Founders / governance members can see all
CREATE POLICY "biz_submissions_select_governance"
  ON public.business_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('founder', 'governance_member')
    )
  );

CREATE POLICY "biz_submissions_update_governance"
  ON public.business_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('founder', 'governance_member')
    )
  );

CREATE INDEX idx_biz_submissions_submitter ON public.business_submissions(submitter_profile_id);
CREATE INDEX idx_biz_submissions_status ON public.business_submissions(status);
CREATE INDEX idx_biz_submissions_type ON public.business_submissions(business_type);
