CREATE TABLE IF NOT EXISTS business_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Submitter info
  submitter_wallet TEXT NOT NULL,
  submitter_email TEXT,
  
  -- Business details
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL, -- 'defi', 'gaming', 'social', 'art_culture', 'other'
  description TEXT NOT NULL,
  
  -- V4 Hook info
  hook_address TEXT,
  hook_deployed BOOLEAN DEFAULT false,
  estimated_volume BIGINT DEFAULT 0,
  
  -- Agency support
  requesting_agency_support BOOLEAN DEFAULT false,
  agency_services TEXT[], -- ['marketing', 'development', 'design', 'tokenomics']
  budget_range TEXT, -- 'under_10k', '10k_50k', '50k_100k', 'over_100k'
  
  -- Property preferences
  preferred_district TEXT,
  property_size TEXT DEFAULT '20x20', -- '20x20', '40x40', '60x60', etc.
  
  -- Submission metadata
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected'
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Associated proposal
  proposal_id UUID REFERENCES proposals(id),
  
  -- Additional info
  website_url TEXT,
  twitter_url TEXT,
  discord_url TEXT,
  whitepaper_url TEXT,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  CONSTRAINT valid_business_type CHECK (business_type IN ('defi', 'gaming', 'social', 'art_culture', 'entertainment', 'infrastructure', 'other'))
);

CREATE TABLE IF NOT EXISTS submission_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES business_submissions(id) ON DELETE CASCADE,
  fee_amount BIGINT NOT NULL,
  fee_token TEXT NOT NULL DEFAULT 'VOID',
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  transaction_hash TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_status ON business_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_wallet ON business_submissions(submitter_wallet);
CREATE INDEX IF NOT EXISTS idx_submissions_hook ON business_submissions(hook_address);
CREATE INDEX IF NOT EXISTS idx_submission_fees_submission ON submission_fees(submission_id);

-- Enable RLS
ALTER TABLE business_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_fees ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view submissions" ON business_submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can create submissions" ON business_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Submitters can update their own" ON business_submissions FOR UPDATE USING (submitter_wallet = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Anyone can view fees" ON submission_fees FOR SELECT USING (true);
CREATE POLICY "Anyone can create fees" ON submission_fees FOR INSERT WITH CHECK (true);
