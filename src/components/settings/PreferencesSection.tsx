import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Cpu, Bell, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { getUserPreferences, updatePreferredModel, updateEmailNotifications } from '@/services/supabase/preferencesService';
import { toast } from '@/components/ui/use-toast';

const AI_MODELS = [
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Fast & balanced' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Best quality' },
  { value: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', description: 'Fastest' },
  { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini', description: 'Strong reasoning' },
  { value: 'openai/gpt-5-nano', label: 'GPT-5 Nano', description: 'Cost efficient' },
];

const PreferencesSection = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferredModel, setPreferredModel] = useState('google/gemini-2.5-flash');
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;
      
      try {
        const prefs = await getUserPreferences(user.id);
        if (prefs) {
          setPreferredModel(prefs.preferred_ai_model || 'google/gemini-2.5-flash');
          setEmailNotifications(prefs.email_notifications_enabled ?? true);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const handleModelChange = async (model: string) => {
    if (!user?.id) return;
    
    setSaving(true);
    setPreferredModel(model);
    
    const success = await updatePreferredModel(user.id, model);
    setSaving(false);
    
    if (success) {
      toast({
        title: 'Preference saved',
        description: 'Your preferred AI model has been updated.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save preference.',
        variant: 'destructive',
      });
    }
  };

  const handleNotificationsChange = async (enabled: boolean) => {
    if (!user?.id) return;
    
    setSaving(true);
    setEmailNotifications(enabled);
    
    const success = await updateEmailNotifications(user.id, enabled);
    setSaving(false);
    
    if (success) {
      toast({
        title: 'Preference saved',
        description: `Email notifications ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save preference.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Preferences
        </CardTitle>
        <CardDescription>
          Customize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Model Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            Preferred AI Model
          </Label>
          <Select value={preferredModel} onValueChange={handleModelChange} disabled={saving}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex flex-col">
                    <span>{model.label}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This model will be used by default for story generation
          </p>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive alerts when approaching usage limits
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={handleNotificationsChange}
            disabled={saving}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesSection;
