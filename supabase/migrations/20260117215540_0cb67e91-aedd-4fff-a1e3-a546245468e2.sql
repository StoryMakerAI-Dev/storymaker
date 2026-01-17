-- Create export_schedules table for scheduled exports
CREATE TABLE public.export_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  schedule_name TEXT NOT NULL,
  cron_expression TEXT NOT NULL,
  export_format TEXT NOT NULL DEFAULT 'pdf',
  template_id TEXT NOT NULL DEFAULT 'classic',
  delivery_method TEXT NOT NULL DEFAULT 'archive',
  delivery_email TEXT,
  cloud_provider TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.export_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own schedules"
  ON public.export_schedules FOR SELECT
  USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can create their own schedules"
  ON public.export_schedules FOR INSERT
  WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own schedules"
  ON public.export_schedules FOR UPDATE
  USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own schedules"
  ON public.export_schedules FOR DELETE
  USING ((auth.uid())::text = user_id);

-- Create export_archives table for downloadable archives
CREATE TABLE public.export_archives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  schedule_id UUID REFERENCES public.export_schedules(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  story_count INTEGER NOT NULL DEFAULT 0,
  export_format TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days')
);

-- Enable RLS
ALTER TABLE public.export_archives ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own archives"
  ON public.export_archives FOR SELECT
  USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can create their own archives"
  ON public.export_archives FOR INSERT
  WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own archives"
  ON public.export_archives FOR DELETE
  USING ((auth.uid())::text = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_export_schedules_updated_at
  BEFORE UPDATE ON public.export_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();