-- Centralized XP granting function
CREATE OR REPLACE FUNCTION public.grant_xp(
  p_profile_id UUID,
  p_track TEXT,
  p_amount INTEGER,
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_row public.player_xp%ROWTYPE;
  v_new_total BIGINT;
  v_new_level INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RETURN;
  END IF;

  -- Ensure row exists
  INSERT INTO public.player_xp (profile_id)
  VALUES (p_profile_id)
  ON CONFLICT (profile_id) DO NOTHING;

  SELECT * INTO v_row
  FROM public.player_xp
  WHERE profile_id = p_profile_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Increment per-track
  IF p_track = 'explorer' THEN
    v_row.explorer_xp := v_row.explorer_xp + p_amount;
  ELSIF p_track = 'builder' THEN
    v_row.builder_xp := v_row.builder_xp + p_amount;
  ELSE
    v_row.operator_xp := v_row.operator_xp + p_amount;
  END IF;

  -- Update total
  v_new_total := v_row.total_xp + p_amount;
  v_row.total_xp := v_new_total;

  -- Level curve: 100 * L^2
  v_new_level := GREATEST(1, FLOOR(SQRT(v_new_total::numeric / 100)));

  UPDATE public.player_xp
  SET total_xp = v_row.total_xp,
      explorer_xp = v_row.explorer_xp,
      builder_xp = v_row.builder_xp,
      operator_xp = v_row.operator_xp,
      level = v_new_level,
      updated_at = NOW()
  WHERE profile_id = p_profile_id;

  -- Log event
  INSERT INTO public.xp_events (profile_id, event_type, track, amount, metadata)
  VALUES (p_profile_id, p_event_type, p_track, p_amount, COALESCE(p_metadata, '{}'::jsonb));
END;
$$;
