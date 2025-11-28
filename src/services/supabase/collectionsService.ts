import { supabase } from '@/integrations/supabase/client';

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export const getUserCollections = async (userId: string): Promise<{ data: Collection[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('story_collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as Collection[], error: null };
  } catch (error) {
    console.error('Error fetching collections:', error);
    return { data: null, error: error as Error };
  }
};

export const createCollection = async (
  userId: string,
  name: string,
  description?: string,
  color?: string
): Promise<{ data: Collection | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('story_collections')
      .insert({
        user_id: userId,
        name,
        description,
        color: color || '#3b82f6',
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as Collection, error: null };
  } catch (error) {
    console.error('Error creating collection:', error);
    return { data: null, error: error as Error };
  }
};

export const addStoryToCollection = async (
  collectionId: string,
  storyId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('collection_stories')
      .insert({
        collection_id: collectionId,
        story_id: storyId,
      });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error adding story to collection:', error);
    return { error: error as Error };
  }
};

export const removeStoryFromCollection = async (
  collectionId: string,
  storyId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('collection_stories')
      .delete()
      .eq('collection_id', collectionId)
      .eq('story_id', storyId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error removing story from collection:', error);
    return { error: error as Error };
  }
};

export const getCollectionStories = async (collectionId: string) => {
  try {
    const { data, error } = await supabase
      .from('collection_stories')
      .select(`
        story_id,
        added_at,
        stories:story_id (
          id,
          title,
          content,
          created_at,
          cover_image_url
        )
      `)
      .eq('collection_id', collectionId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching collection stories:', error);
    return { data: null, error: error as Error };
  }
};