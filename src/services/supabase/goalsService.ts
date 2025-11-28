import { supabase } from '@/integrations/supabase/client';

export interface WritingGoal {
  id: string;
  user_id: string;
  goal_type: 'daily' | 'weekly';
  target_count: number;
  current_count: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export const getActiveGoals = async (userId: string): Promise<{ data: WritingGoal[] | null; error: Error | null }> => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('writing_goals')
      .select('*')
      .eq('user_id', userId)
      .gte('period_end', now)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as WritingGoal[], error: null };
  } catch (error) {
    console.error('Error fetching goals:', error);
    return { data: null, error: error as Error };
  }
};

export const createGoal = async (
  userId: string,
  goalType: 'daily' | 'weekly',
  targetCount: number
): Promise<{ data: WritingGoal | null; error: Error | null }> => {
  try {
    const periodStart = new Date();
    const periodEnd = new Date();
    
    if (goalType === 'daily') {
      periodEnd.setDate(periodEnd.getDate() + 1);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 7);
    }

    const { data, error } = await supabase
      .from('writing_goals')
      .insert({
        user_id: userId,
        goal_type: goalType,
        target_count: targetCount,
        current_count: 0,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as WritingGoal, error: null };
  } catch (error) {
    console.error('Error creating goal:', error);
    return { data: null, error: error as Error };
  }
};

export const updateGoalProgress = async (
  goalId: string,
  increment: number = 1
): Promise<{ error: Error | null }> => {
  try {
    const { data: goal, error: fetchError } = await supabase
      .from('writing_goals')
      .select('current_count')
      .eq('id', goalId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('writing_goals')
      .update({ current_count: (goal.current_count || 0) + increment })
      .eq('id', goalId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return { error: error as Error };
  }
};