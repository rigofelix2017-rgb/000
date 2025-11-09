-- Leaderboards
-- Materialized views for performant leaderboard queries

-- XP Leaderboard (global)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_xp AS
SELECT
  p.id AS profile_id,
  p.display_name,
  p.avatar_url,
  x.total_xp,
  x.level,
  x.builder_xp,
  x.operator_xp,
  x.explorer_xp,
  RANK() OVER (ORDER BY x.total_xp DESC) AS rank
FROM public.player_xp x
JOIN public.profiles p ON p.id = x.profile_id
ORDER BY x.total_xp DESC;

CREATE UNIQUE INDEX idx_leaderboard_xp_profile ON public.leaderboard_xp(profile_id);
CREATE INDEX idx_leaderboard_xp_rank ON public.leaderboard_xp(rank);

-- Builder Track Leaderboard
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_builder AS
SELECT
  p.id AS profile_id,
  p.display_name,
  p.avatar_url,
  x.builder_xp,
  x.level,
  RANK() OVER (ORDER BY x.builder_xp DESC) AS rank
FROM public.player_xp x
JOIN public.profiles p ON p.id = x.profile_id
ORDER BY x.builder_xp DESC;

CREATE UNIQUE INDEX idx_leaderboard_builder_profile ON public.leaderboard_builder(profile_id);

-- Operator Track Leaderboard
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_operator AS
SELECT
  p.id AS profile_id,
  p.display_name,
  p.avatar_url,
  x.operator_xp,
  x.level,
  RANK() OVER (ORDER BY x.operator_xp DESC) AS rank
FROM public.player_xp x
JOIN public.profiles p ON p.id = x.profile_id
ORDER BY x.operator_xp DESC;

CREATE UNIQUE INDEX idx_leaderboard_operator_profile ON public.leaderboard_operator(profile_id);

-- Explorer Track Leaderboard
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_explorer AS
SELECT
  p.id AS profile_id,
  p.display_name,
  p.avatar_url,
  x.explorer_xp,
  x.level,
  RANK() OVER (ORDER BY x.explorer_xp DESC) AS rank
FROM public.player_xp x
JOIN public.profiles p ON p.id = x.profile_id
ORDER BY x.explorer_xp DESC;

CREATE UNIQUE INDEX idx_leaderboard_explorer_profile ON public.leaderboard_explorer(profile_id);

-- Agency Leaderboard
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_agencies AS
SELECT
  a.id AS agency_id,
  a.name,
  a.slug,
  a.logo_url,
  x.total_xp,
  x.level,
  RANK() OVER (ORDER BY x.total_xp DESC) AS rank,
  COUNT(am.profile_id) AS member_count
FROM public.agency_xp x
JOIN public.agencies a ON a.id = x.agency_id
LEFT JOIN public.agency_members am ON am.agency_id = a.id
GROUP BY a.id, a.name, a.slug, a.logo_url, x.total_xp, x.level
ORDER BY x.total_xp DESC;

CREATE UNIQUE INDEX idx_leaderboard_agencies_id ON public.leaderboard_agencies(agency_id);

-- Property Owner Leaderboard (most parcels owned)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_land_owners AS
SELECT
  p.id AS profile_id,
  p.display_name,
  p.avatar_url,
  COUNT(lp.parcel_id) AS parcel_count,
  SUM(lp.price_void) AS total_value,
  RANK() OVER (ORDER BY COUNT(lp.parcel_id) DESC) AS rank
FROM public.profiles p
JOIN public.land_parcels lp ON lp.owner_wallet = p.wallet_address
WHERE lp.status = 'owned'
GROUP BY p.id, p.display_name, p.avatar_url
ORDER BY parcel_count DESC;

CREATE UNIQUE INDEX idx_leaderboard_land_owners_profile ON public.leaderboard_land_owners(profile_id);

-- Note: Refresh these views periodically via cron job:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_xp;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_builder;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_operator;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_explorer;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_agencies;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_land_owners;
