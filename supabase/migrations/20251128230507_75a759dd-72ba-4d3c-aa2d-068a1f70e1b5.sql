-- Add model_used field to stories table to track AI model usage
ALTER TABLE public.stories 
ADD COLUMN model_used text;

-- Create writing_goals table
CREATE TABLE public.writing_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  goal_type text NOT NULL, -- 'daily' or 'weekly'
  target_count integer NOT NULL,
  current_count integer NOT NULL DEFAULT 0,
  period_start timestamp with time zone NOT NULL DEFAULT now(),
  period_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for writing_goals
ALTER TABLE public.writing_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for writing_goals
CREATE POLICY "Users can view their own goals"
ON public.writing_goals FOR SELECT
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can create their own goals"
ON public.writing_goals FOR INSERT
WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own goals"
ON public.writing_goals FOR UPDATE
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own goals"
ON public.writing_goals FOR DELETE
USING ((auth.uid())::text = user_id);

-- Create story_templates table
CREATE TABLE public.story_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  genre text NOT NULL,
  description text NOT NULL,
  starter_text text NOT NULL,
  age_group text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for story_templates (public read access)
ALTER TABLE public.story_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone"
ON public.story_templates FOR SELECT
USING (true);

-- Create character_library table
CREATE TABLE public.character_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  traits text,
  backstory text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for character_library
ALTER TABLE public.character_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own characters"
ON public.character_library FOR SELECT
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can create their own characters"
ON public.character_library FOR INSERT
WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own characters"
ON public.character_library FOR UPDATE
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own characters"
ON public.character_library FOR DELETE
USING ((auth.uid())::text = user_id);

-- Create story_collections table
CREATE TABLE public.story_collections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  name text NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for story_collections
ALTER TABLE public.story_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collections"
ON public.story_collections FOR SELECT
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can create their own collections"
ON public.story_collections FOR INSERT
WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own collections"
ON public.story_collections FOR UPDATE
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own collections"
ON public.story_collections FOR DELETE
USING ((auth.uid())::text = user_id);

-- Create junction table for collections and stories
CREATE TABLE public.collection_stories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id uuid NOT NULL REFERENCES public.story_collections(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(collection_id, story_id)
);

-- Enable RLS for collection_stories
ALTER TABLE public.collection_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their collection stories"
ON public.collection_stories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.story_collections
    WHERE story_collections.id = collection_stories.collection_id
    AND (auth.uid())::text = story_collections.user_id
  )
);

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_writing_goals_updated_at
BEFORE UPDATE ON public.writing_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_character_library_updated_at
BEFORE UPDATE ON public.character_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_story_collections_updated_at
BEFORE UPDATE ON public.story_collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default story templates
INSERT INTO public.story_templates (name, genre, description, starter_text, age_group) VALUES
('The Quest Begins', 'fantasy', 'A hero embarks on an epic journey to save their homeland', 'In a land where magic flowed through ancient forests and mystical creatures roamed free, a young hero discovered their true destiny. The kingdom was in peril, and only they could...', 'children'),
('Mystery at Midnight', 'mystery', 'A detective investigates a puzzling case that defies explanation', 'The clock struck midnight as Detective Morgan examined the crime scene. Nothing made sense. The doors were locked from inside, yet the valuable artifact had vanished without a trace...', 'teens'),
('First Day Adventure', 'realistic', 'A child faces the excitement and anxiety of a new beginning', 'Sarah took a deep breath as she stood at the entrance of her new school. Everything felt so different from what she knew before. But as she stepped through those doors...', 'children'),
('The Time Traveler', 'sci-fi', 'A scientist discovers the secret to traveling through time', 'Dr. Chen stared at the swirling portal in disbelief. Years of calculations, countless failed experiments, and now—finally—a doorway through time itself. But where would it lead?', 'teens'),
('The Enchanted Forest', 'fantasy', 'A magical forest holds secrets waiting to be discovered', 'Beyond the village, where no one dared to venture, stood the Enchanted Forest. Its trees whispered ancient secrets, and its paths changed with the phases of the moon...', 'children');