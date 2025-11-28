import { supabase } from '@/integrations/supabase/client';

export interface StoryTemplate {
  id: string;
  name: string;
  genre: string;
  description: string;
  starter_text: string;
  age_group: string;
  created_at: string;
}

export const getTemplates = async (): Promise<{ data: StoryTemplate[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('story_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as StoryTemplate[], error: null };
  } catch (error) {
    console.error('Error fetching templates:', error);
    return { data: null, error: error as Error };
  }
};

export const getTemplatesByGenre = async (genre: string): Promise<{ data: StoryTemplate[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('story_templates')
      .select('*')
      .eq('genre', genre)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as StoryTemplate[], error: null };
  } catch (error) {
    console.error('Error fetching templates by genre:', error);
    return { data: null, error: error as Error };
  }
};