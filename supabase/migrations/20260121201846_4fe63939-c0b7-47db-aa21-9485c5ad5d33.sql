-- Create tier upgrade requests table
CREATE TABLE public.tier_upgrade_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  current_tier TEXT NOT NULL,
  requested_tier TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tier_upgrade_requests ENABLE ROW LEVEL SECURITY;

-- Users can create their own upgrade requests
CREATE POLICY "Users can create upgrade requests" 
ON public.tier_upgrade_requests 
FOR INSERT 
WITH CHECK (user_id = ((current_setting('request.headers'::text, true))::json ->> 'x-user-id'::text));

-- Users can view their own upgrade requests
CREATE POLICY "Users can view their own upgrade requests" 
ON public.tier_upgrade_requests 
FOR SELECT 
USING (user_id = ((current_setting('request.headers'::text, true))::json ->> 'x-user-id'::text));

-- Admins can view all upgrade requests
CREATE POLICY "Admins can view all upgrade requests" 
ON public.tier_upgrade_requests 
FOR SELECT 
USING (is_admin(((current_setting('request.headers'::text, true))::json ->> 'x-user-id'::text)));

-- Admins can update upgrade requests
CREATE POLICY "Admins can update upgrade requests" 
ON public.tier_upgrade_requests 
FOR UPDATE 
USING (is_admin(((current_setting('request.headers'::text, true))::json ->> 'x-user-id'::text)));

-- Create trigger for updated_at
CREATE TRIGGER update_tier_upgrade_requests_updated_at
BEFORE UPDATE ON public.tier_upgrade_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();