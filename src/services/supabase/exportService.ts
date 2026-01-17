import { supabase } from '@/integrations/supabase/client';

export interface ExportSchedule {
  id: string;
  user_id: string;
  schedule_name: string;
  cron_expression: string;
  export_format: string;
  template_id: string;
  delivery_method: string;
  delivery_email: string | null;
  cloud_provider: string | null;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExportArchive {
  id: string;
  user_id: string;
  schedule_id: string | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  story_count: number;
  export_format: string;
  created_at: string;
  expires_at: string;
}

export const getExportSchedules = async (userId: string) => {
  const { data, error } = await supabase
    .from('export_schedules')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ExportSchedule[];
};

export const createExportSchedule = async (schedule: Omit<ExportSchedule, 'id' | 'created_at' | 'updated_at' | 'last_run_at' | 'next_run_at'>) => {
  const { data, error } = await supabase
    .from('export_schedules')
    .insert(schedule)
    .select()
    .single();

  if (error) throw error;
  return data as ExportSchedule;
};

export const updateExportSchedule = async (id: string, updates: Partial<ExportSchedule>) => {
  const { data, error } = await supabase
    .from('export_schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ExportSchedule;
};

export const deleteExportSchedule = async (id: string) => {
  const { error } = await supabase
    .from('export_schedules')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getExportArchives = async (userId: string) => {
  const { data, error } = await supabase
    .from('export_archives')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ExportArchive[];
};

export const createExportArchive = async (archive: Omit<ExportArchive, 'id' | 'created_at' | 'expires_at'>) => {
  const { data, error } = await supabase
    .from('export_archives')
    .insert(archive)
    .select()
    .single();

  if (error) throw error;
  return data as ExportArchive;
};

export const deleteExportArchive = async (id: string) => {
  const { error } = await supabase
    .from('export_archives')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Common cron expressions
export const CRON_PRESETS = [
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at 6 AM', value: '0 6 * * *' },
  { label: 'Every Monday at midnight', value: '0 0 * * 1' },
  { label: 'Every week on Sunday', value: '0 0 * * 0' },
  { label: 'First day of every month', value: '0 0 1 * *' },
  { label: 'Every 12 hours', value: '0 */12 * * *' },
];
