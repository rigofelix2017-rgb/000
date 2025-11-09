-- Access Rules
-- Token-gating for districts, events, and buildings

CREATE TABLE IF NOT EXISTS public.access_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL,         -- 'district' | 'event' | 'building' | 'zone'
  target_id TEXT NOT NULL,           -- district_id OR event_id OR building_id
  rule_type TEXT NOT NULL,           -- 'min_token' | 'nft_hold' | 'role' | 'xvoid_tier'
  token_address TEXT,                -- Base token contract address
  token_chain_id INTEGER DEFAULT 8453, -- Base = 8453
  min_balance NUMERIC(38,18),
  nft_contract TEXT,                 -- NFT contract for hold checks
  required_role TEXT,                -- 'founder', 'governance_member', etc
  required_tier TEXT,                -- for xvoid_tier: 'bronze', 'silver', 'gold', 'diamond'
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.access_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "access_rules_select_all"
  ON public.access_rules FOR SELECT
  USING (true);

CREATE POLICY "access_rules_insert_governance"
  ON public.access_rules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('founder', 'governance_member')
    )
  );

CREATE INDEX idx_access_rules_target ON public.access_rules(target_type, target_id);
CREATE INDEX idx_access_rules_active ON public.access_rules(is_active);
