-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create subscription_tier enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'basic', 'pro', 'enterprise');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create subscription_tiers configuration table
CREATE TABLE public.subscription_tiers_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier subscription_tier NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    story_limit_per_day INTEGER NOT NULL DEFAULT 10,
    image_limit_per_day INTEGER NOT NULL DEFAULT 5,
    chat_limit_per_day INTEGER NOT NULL DEFAULT 20,
    story_limit_per_month INTEGER NOT NULL DEFAULT 100,
    image_limit_per_month INTEGER NOT NULL DEFAULT 50,
    chat_limit_per_month INTEGER NOT NULL DEFAULT 500,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default tier configurations
INSERT INTO public.subscription_tiers_config (tier, display_name, story_limit_per_day, image_limit_per_day, chat_limit_per_day, story_limit_per_month, image_limit_per_month, chat_limit_per_month) VALUES
('free', 'Free', 5, 2, 10, 30, 15, 100),
('basic', 'Basic', 15, 8, 30, 150, 75, 500),
('pro', 'Pro', 50, 25, 100, 500, 250, 2000),
('enterprise', 'Enterprise', 500, 250, 1000, 10000, 5000, 50000);

-- Enable RLS on subscription_tiers_config
ALTER TABLE public.subscription_tiers_config ENABLE ROW LEVEL SECURITY;

-- Create user_preferences table for AI model preference and other settings
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    preferred_ai_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    rate_limit_warning_threshold INTEGER NOT NULL DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create usage_alerts table to track sent notifications
CREATE TABLE public.usage_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    function_name TEXT,
    threshold_percentage INTEGER,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    email_sent BOOLEAN DEFAULT false
);

-- Enable RLS on usage_alerts
ALTER TABLE public.usage_alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = current_setting('request.headers', true)::json->>'x-user-id');

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin(current_setting('request.headers', true)::json->>'x-user-id'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.is_admin(current_setting('request.headers', true)::json->>'x-user-id'));

-- RLS Policies for subscription_tiers_config (read-only for all authenticated, write for admins)
CREATE POLICY "Anyone can view tier configs"
ON public.subscription_tiers_config
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tier configs"
ON public.subscription_tiers_config
FOR ALL
USING (public.is_admin(current_setting('request.headers', true)::json->>'x-user-id'));

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences
FOR SELECT
USING (user_id = current_setting('request.headers', true)::json->>'x-user-id');

CREATE POLICY "Users can manage their own preferences"
ON public.user_preferences
FOR ALL
USING (user_id = current_setting('request.headers', true)::json->>'x-user-id');

CREATE POLICY "Admins can view all preferences"
ON public.user_preferences
FOR SELECT
USING (public.is_admin(current_setting('request.headers', true)::json->>'x-user-id'));

-- RLS Policies for usage_alerts
CREATE POLICY "Users can view their own alerts"
ON public.usage_alerts
FOR SELECT
USING (user_id = current_setting('request.headers', true)::json->>'x-user-id');

CREATE POLICY "Admins can view all alerts"
ON public.usage_alerts
FOR SELECT
USING (public.is_admin(current_setting('request.headers', true)::json->>'x-user-id'));

-- Add trigger for user_preferences updated_at
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for subscription_tiers_config updated_at
CREATE TRIGGER update_subscription_tiers_config_updated_at
BEFORE UPDATE ON public.subscription_tiers_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on user_id columns for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_usage_alerts_user_id ON public.usage_alerts(user_id);
CREATE INDEX idx_usage_alerts_sent_at ON public.usage_alerts(sent_at);