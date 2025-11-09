CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_type TEXT NOT NULL, -- 'business_approval', 'bad_actor_removal', 'parameter_change', 'district_allocation'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Related entities
  hook_address TEXT, -- For business approval/removal
  property_id UUID REFERENCES properties(id),
  target_wallet TEXT, -- For bad actor removal
  
  -- Proposal details
  proposer_wallet TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  voting_ends_at TIMESTAMPTZ NOT NULL,
  
  -- Voting results
  votes_for BIGINT DEFAULT 0,
  votes_against BIGINT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'passed', 'rejected', 'executed'
  executed_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB,
  
  CONSTRAINT valid_proposal_type CHECK (proposal_type IN ('business_approval', 'bad_actor_removal', 'parameter_change', 'district_allocation')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'passed', 'rejected', 'executed'))
);

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  voter_wallet TEXT NOT NULL,
  vote_direction TEXT NOT NULL, -- 'for' or 'against'
  voting_power BIGINT NOT NULL, -- Token balance at snapshot
  voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_vote_direction CHECK (vote_direction IN ('for', 'against')),
  CONSTRAINT unique_vote_per_proposal UNIQUE (proposal_id, voter_wallet)
);

CREATE TABLE IF NOT EXISTS governance_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

-- Insert default governance parameters
INSERT INTO governance_config (config_key, config_value) VALUES
  ('voting_period_days', '7'),
  ('quorum_threshold', '0.66'), -- 66% supermajority
  ('property_tax_rate', '0.01'), -- 1% annual
  ('inactive_period_days', '180'), -- 6 months
  ('grace_period_days', '30'),
  ('base_property_price', '1000'), -- Base VOID price
  ('commercial_multiplier', '5'),
  ('tier_1_multiplier', '10'),
  ('tier_2_multiplier', '5'),
  ('tier_3_multiplier', '1'),
  ('tier_4_multiplier', '0.5')
ON CONFLICT (config_key) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_type ON proposals(proposal_type);
CREATE INDEX IF NOT EXISTS idx_proposals_voting_ends ON proposals(voting_ends_at);
CREATE INDEX IF NOT EXISTS idx_votes_proposal ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_wallet ON votes(voter_wallet);

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can read proposals and votes
CREATE POLICY "Anyone can view proposals" ON proposals FOR SELECT USING (true);
CREATE POLICY "Anyone can view votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Anyone can view config" ON governance_config FOR SELECT USING (true);

-- Anyone can create proposals (we'll add token gating in the app layer)
CREATE POLICY "Anyone can create proposals" ON proposals FOR INSERT WITH CHECK (true);

-- Anyone can vote (token gating in app layer)
CREATE POLICY "Anyone can vote" ON votes FOR INSERT WITH CHECK (true);
