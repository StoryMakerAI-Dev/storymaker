import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

interface ModelStats {
  gemini: number;
  chatgpt: number;
  total: number;
}

const UsageStats: React.FC = () => {
  const { userId } = useAuth();
  const [stats, setStats] = useState<ModelStats>({ gemini: 0, chatgpt: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('stories')
          .select('model_used')
          .eq('user_id', userId);

        if (error) throw error;

        const geminiCount = data?.filter(story => 
          story.model_used?.includes('gemini')
        ).length || 0;
        
        const chatgptCount = data?.filter(story => 
          story.model_used?.includes('gpt') || story.model_used?.includes('openai')
        ).length || 0;

        setStats({
          gemini: geminiCount,
          chatgpt: chatgptCount,
          total: data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const geminiPercentage = stats.total > 0 ? (stats.gemini / stats.total) * 100 : 0;
  const chatgptPercentage = stats.total > 0 ? (stats.chatgpt / stats.total) * 100 : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>AI Model Usage</CardTitle>
        </div>
        <CardDescription>
          Track which AI models you've used for story generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">Gemini</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.gemini} stories ({geminiPercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500"
              style={{ width: `${geminiPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="font-medium">ChatGPT</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.chatgpt} stories ({chatgptPercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-secondary to-secondary-glow h-2 rounded-full transition-all duration-500"
              style={{ width: `${chatgptPercentage}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Stories</span>
            <span className="text-2xl font-bold text-primary">{stats.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStats;