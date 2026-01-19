import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, BookOpen, Image, MessageSquare, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { getUserPreferences, getSubscriptionTierConfig } from '@/services/supabase/preferencesService';

interface UsageData {
  stories: number;
  images: number;
  chats: number;
  storyLimit: number;
  imageLimit: number;
  chatLimit: number;
}

const UsageSection = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<UsageData>({
    stories: 0,
    images: 0,
    chats: 0,
    storyLimit: 10,
    imageLimit: 5,
    chatLimit: 20,
  });

  useEffect(() => {
    const loadUsage = async () => {
      if (!user?.id) return;
      
      try {
        // Get user preferences for tier
        const prefs = await getUserPreferences(user.id);
        const tier = prefs?.subscription_tier || 'free';
        
        // Get tier limits
        const tierConfig = await getSubscriptionTierConfig(tier);
        
        // Get today's usage from ai_usage_logs
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: logs, error } = await supabase
          .from('ai_usage_logs')
          .select('function_name')
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString());
        
        if (error) {
          console.error('Error fetching usage logs:', error);
        }
        
        // Count by type
        const storyCount = logs?.filter(l => l.function_name === 'generate-story').length || 0;
        const imageCount = logs?.filter(l => l.function_name === 'generate-story-image').length || 0;
        const chatCount = logs?.filter(l => l.function_name === 'chat-assistant').length || 0;
        
        setUsage({
          stories: storyCount,
          images: imageCount,
          chats: chatCount,
          storyLimit: tierConfig?.story_limit_per_day || 10,
          imageLimit: tierConfig?.image_limit_per_day || 5,
          chatLimit: tierConfig?.chat_limit_per_day || 20,
        });
      } catch (error) {
        console.error('Error loading usage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, [user?.id]);

  const totalDailyUsage = usage.stories + usage.images + usage.chats;
  const totalLimit = usage.storyLimit + usage.imageLimit + usage.chatLimit;
  const dailyPercentage = Math.min((totalDailyUsage / totalLimit) * 100, 100);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage > 80) return '[&>div]:bg-destructive';
    if (percentage > 50) return '[&>div]:bg-yellow-500';
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Today's Usage
        </CardTitle>
        <CardDescription>
          Track your AI generation usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Daily Usage</span>
            <span className="font-medium">{totalDailyUsage} / {totalLimit}</span>
          </div>
          <Progress 
            value={dailyPercentage} 
            className={`h-3 ${dailyPercentage > 80 ? '[&>div]:bg-destructive' : dailyPercentage > 50 ? '[&>div]:bg-yellow-500' : ''}`}
          />
          {dailyPercentage > 80 && (
            <p className="text-xs text-destructive">
              You're approaching your daily limit
            </p>
          )}
        </div>

        {/* Breakdown by Type */}
        <div className="grid gap-4">
          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Stories</p>
                  <p className="text-xs text-muted-foreground">{usage.stories} / {usage.storyLimit} today</p>
                </div>
              </div>
              <span className="text-2xl font-bold">{usage.stories}</span>
            </div>
            <Progress 
              value={(usage.stories / usage.storyLimit) * 100} 
              className={`h-1.5 ${getProgressColor(usage.stories, usage.storyLimit)}`}
            />
          </div>

          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-secondary/10 p-2">
                  <Image className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Images</p>
                  <p className="text-xs text-muted-foreground">{usage.images} / {usage.imageLimit} today</p>
                </div>
              </div>
              <span className="text-2xl font-bold">{usage.images}</span>
            </div>
            <Progress 
              value={(usage.images / usage.imageLimit) * 100} 
              className={`h-1.5 ${getProgressColor(usage.images, usage.imageLimit)}`}
            />
          </div>

          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-2">
                  <MessageSquare className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Chat Messages</p>
                  <p className="text-xs text-muted-foreground">{usage.chats} / {usage.chatLimit} today</p>
                </div>
              </div>
              <span className="text-2xl font-bold">{usage.chats}</span>
            </div>
            <Progress 
              value={(usage.chats / usage.chatLimit) * 100} 
              className={`h-1.5 ${getProgressColor(usage.chats, usage.chatLimit)}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageSection;
