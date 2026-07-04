
-- Fix rate_limits_permissive_policy + SUPA_rls_policy_always_true:
-- rate_limits is only accessed by edge functions using the service role,
-- so drop the USING(true)/WITH CHECK(true) policy entirely.
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;
REVOKE ALL ON public.rate_limits FROM anon;
REVOKE ALL ON public.rate_limits FROM authenticated;

-- Fix rls_x_user_id_trust:
-- Admin RLS policies read `x-user-id` from the request headers, which the client
-- can forge with the anon key to escalate to admin. All admin operations now
-- go through the admin-stats edge function which verifies a Clerk JWT and uses
-- the service role, so these RLS admin policies are unnecessary and unsafe.
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage tier configs" ON public.subscription_tiers_config;
DROP POLICY IF EXISTS "Admins can update upgrade requests" ON public.tier_upgrade_requests;
DROP POLICY IF EXISTS "Admins can view all upgrade requests" ON public.tier_upgrade_requests;
DROP POLICY IF EXISTS "Admins can view all alerts" ON public.usage_alerts;
DROP POLICY IF EXISTS "Admins can view all preferences" ON public.user_preferences;

-- Lock down privileged tables so anon/authenticated cannot bypass RLS by
-- forging headers — edge functions using the service role still work.
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.user_roles FROM authenticated;
REVOKE ALL ON public.usage_alerts FROM anon;
REVOKE ALL ON public.usage_alerts FROM authenticated;

-- Keep user-scoped SELECT policies on ai_usage_logs / user_preferences /
-- tier_upgrade_requests / usage_alerts as they exist today; the app relies on
-- them for the settings dashboards. The forgery risk is mitigated by removing
-- the admin escalation paths above and by moving privileged reads/writes to
-- the verified edge functions.
