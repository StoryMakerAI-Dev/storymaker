import { supabase } from '@/integrations/supabase/client';
import { StoryParams } from '@/types/story';

export interface SavedStoryData {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  params: any; // Using any to handle Json type from Supabase
  version: number;
  parent_story_id: string | null;
  created_at: string;
  updated_at: string;
}

export const saveStory = async (
  userId: string,
  title: string,
  content: string,
  params: StoryParams,
  coverImageUrl?: string,
  parentStoryId?: string
): Promise<{ data: SavedStoryData | null; error: Error | null }> => {
  try {
    // Add watermark to content
    const watermark = '\n\n---\nCreated with StoryMaker AI';
    const contentWithWatermark = content + watermark;
    
    // Get version number if this is a new version of an existing story
    let version = 1;
    if (parentStoryId) {
      const { data: parentStory } = await supabase
        .from('stories')
        .select('version')
        .eq('id', parentStoryId)
        .single();
      
      if (parentStory) {
        version = parentStory.version + 1;
      }
    }

    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        title,
        content: contentWithWatermark,
        cover_image_url: coverImageUrl || null,
        params,
        version,
        parent_story_id: parentStoryId || null,
        model_used: params.modelUsed || null
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as SavedStoryData, error: null };
  } catch (error) {
    console.error('Error saving story:', error);
    return { data: null, error: error as Error };
  }
};

export const getUserStories = async (
  userId: string
): Promise<{ data: SavedStoryData[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as SavedStoryData[], error: null };
  } catch (error) {
    console.error('Error fetching stories:', error);
    return { data: null, error: error as Error };
  }
};

export const getStoryVersions = async (
  storyId: string
): Promise<{ data: SavedStoryData[] | null; error: Error | null }> => {
  try {
    // Get the parent story ID if this is a version
    const { data: currentStory } = await supabase
      .from('stories')
      .select('parent_story_id, id')
      .eq('id', storyId)
      .single();

    const parentId = currentStory?.parent_story_id || currentStory?.id;

    // Get all versions including the parent
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .or(`id.eq.${parentId},parent_story_id.eq.${parentId}`)
      .order('version', { ascending: true });

    if (error) throw error;
    return { data: data as SavedStoryData[], error: null };
  } catch (error) {
    console.error('Error fetching story versions:', error);
    return { data: null, error: error as Error };
  }
};

export const deleteStory = async (
  storyId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting story:', error);
    return { error: error as Error };
  }
};
