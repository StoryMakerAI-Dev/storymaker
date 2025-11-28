import { supabase } from '@/integrations/supabase/client';

export interface Character {
  id: string;
  user_id: string;
  name: string;
  description: string;
  traits: string | null;
  backstory: string | null;
  created_at: string;
  updated_at: string;
}

export const getUserCharacters = async (userId: string): Promise<{ data: Character[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('character_library')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as Character[], error: null };
  } catch (error) {
    console.error('Error fetching characters:', error);
    return { data: null, error: error as Error };
  }
};

export const createCharacter = async (
  userId: string,
  name: string,
  description: string,
  traits?: string,
  backstory?: string
): Promise<{ data: Character | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('character_library')
      .insert({
        user_id: userId,
        name,
        description,
        traits,
        backstory,
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as Character, error: null };
  } catch (error) {
    console.error('Error creating character:', error);
    return { data: null, error: error as Error };
  }
};

export const updateCharacter = async (
  characterId: string,
  updates: Partial<Omit<Character, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('character_library')
      .update(updates)
      .eq('id', characterId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating character:', error);
    return { error: error as Error };
  }
};

export const deleteCharacter = async (characterId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('character_library')
      .delete()
      .eq('id', characterId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting character:', error);
    return { error: error as Error };
  }
};