import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_ai_model: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  email_notifications_enabled: boolean;
  rate_limit_warning_threshold: number;
  created_at: string;
  updated_at: string;
}

export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching preferences:', error);
      return null;
    }

    return data as UserPreferences | null;
  } catch (error) {
    console.error('Error in getUserPreferences:', error);
    return null;
  }
};

export const createOrUpdatePreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      return null;
    }

    return data as UserPreferences;
  } catch (error) {
    console.error('Error in createOrUpdatePreferences:', error);
    return null;
  }
};

export const updatePreferredModel = async (userId: string, model: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: userId,
          preferred_ai_model: model,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error updating preferred model:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePreferredModel:', error);
    return false;
  }
};

export const updateEmailNotifications = async (userId: string, enabled: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: userId,
          email_notifications_enabled: enabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error updating email notifications:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateEmailNotifications:', error);
    return false;
  }
};

export const getSubscriptionTierConfig = async (tier: 'free' | 'basic' | 'pro' | 'enterprise') => {
  try {
    const { data, error } = await supabase
      .from('subscription_tiers_config')
      .select('*')
      .eq('tier', tier)
      .single();

    if (error) {
      console.error('Error fetching tier config:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSubscriptionTierConfig:', error);
    return null;
  }
};
