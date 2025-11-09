-- Enhanced profiles table with onchain wallet verification

-- Add onchain verification columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_signature TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_verified_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_chain TEXT DEFAULT 'base';

-- Wallet verification log
CREATE TABLE IF NOT EXISTS public.wallet_verifications (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  signature TEXT NOT NULL,
  message TEXT NOT NULL,
  chain TEXT NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wallet_verifications_profile_idx ON public.wallet_verifications(profile_id);
CREATE INDEX IF NOT EXISTS wallet_verifications_wallet_idx ON public.wallet_verifications(wallet_address);

ALTER TABLE public.wallet_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet_verifications_select_own"
  ON public.wallet_verifications FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "wallet_verifications_insert_own"
  ON public.wallet_verifications FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Link player_xp to wallet_address with cascading updates
CREATE OR REPLACE FUNCTION sync_player_xp_wallet() RETURNS TRIGGER AS $$
BEGIN
  -- When wallet_address is updated in profiles, sync to player_xp
  UPDATE public.player_xp
  SET wallet_address = NEW.wallet_address
  WHERE profile_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_player_xp_wallet_trigger
  AFTER UPDATE OF wallet_address ON public.profiles
  FOR EACH ROW
  WHEN (OLD.wallet_address IS DISTINCT FROM NEW.wallet_address)
  EXECUTE FUNCTION sync_player_xp_wallet();
