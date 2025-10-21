-- Remove anonymous access from stories table RLS policies
-- This ensures only authenticated users can access their own stories

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own stories" ON public.stories;
DROP POLICY IF EXISTS "Users can create their own stories" ON public.stories;
DROP POLICY IF EXISTS "Users can update their own stories" ON public.stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON public.stories;

-- Create secure policies that require authentication
CREATE POLICY "Users can view their own stories"
ON public.stories
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own stories"
ON public.stories
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own stories"
ON public.stories
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own stories"
ON public.stories
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);