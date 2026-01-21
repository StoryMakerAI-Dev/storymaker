import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DailyUsage {
  date: string;
  stories: number;
  images: number;
  chats: number;
  total: number;
}

const chartConfig = {
  stories: {
    label: 'Stories',
    color: 'hsl(var(--primary))',
  },
  images: {
    label: 'Images',
    color: 'hsl(var(--secondary))',
  },
  chats: {
    label: 'Chats',
    color: 'hsl(var(--accent))',
  },
  total: {
    label: 'Total',
    color: 'hsl(var(--primary))',
  },
};

const UsageHistoryChart = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<DailyUsage[]>([]);
  const [monthlyData, setMonthlyData] = useState<DailyUsage[]>([]);

  useEffect(() => {
    const loadUsageHistory = async () => {
      if (!user?.id) return;

      try {
        // Get last 30 days of data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: logs, error } = await supabase
          .from('ai_usage_logs')
          .select('function_name, created_at')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching usage history:', error);
          return;
        }

        // Process data by day
        const dailyMap = new Map<string, { stories: number; images: number; chats: number }>();

        logs?.forEach((log) => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          const existing = dailyMap.get(date) || { stories: 0, images: 0, chats: 0 };

          if (log.function_name === 'generate-story') existing.stories++;
          else if (log.function_name === 'generate-story-image') existing.images++;
          else if (log.function_name === 'chat-assistant') existing.chats++;

          dailyMap.set(date, existing);
        });

        // Create weekly data (last 7 days)
        const weekly: DailyUsage[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const usage = dailyMap.get(dateStr) || { stories: 0, images: 0, chats: 0 };
          weekly.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            ...usage,
            total: usage.stories + usage.images + usage.chats,
          });
        }

        // Create monthly data (last 30 days, grouped by week)
        const monthly: DailyUsage[] = [];
        for (let week = 3; week >= 0; week--) {
          const weekData = { stories: 0, images: 0, chats: 0 };
          for (let day = 0; day < 7; day++) {
            const date = new Date();
            date.setDate(date.getDate() - (week * 7 + day));
            const dateStr = date.toISOString().split('T')[0];
            const usage = dailyMap.get(dateStr) || { stories: 0, images: 0, chats: 0 };
            weekData.stories += usage.stories;
            weekData.images += usage.images;
            weekData.chats += usage.chats;
          }
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - (week * 7 + 6));
          monthly.push({
            date: `Week ${4 - week}`,
            ...weekData,
            total: weekData.stories + weekData.images + weekData.chats,
          });
        }

        setWeeklyData(weekly);
        setMonthlyData(monthly);
      } catch (error) {
        console.error('Error loading usage history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsageHistory();
  }, [user?.id]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Usage History
        </CardTitle>
        <CardDescription>
          Track your AI generation trends over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Last 7 Days</TabsTrigger>
            <TabsTrigger value="monthly">Last 4 Weeks</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="stories" fill="hsl(var(--primary))" name="Stories" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="images" fill="hsl(var(--secondary))" name="Images" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="chats" fill="hsl(var(--accent))" name="Chats" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Stories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Images</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Chats</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="stories" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    name="Stories"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="images" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))' }}
                    name="Images"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chats" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                    name="Chats"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold text-primary">
                  {monthlyData.reduce((sum, d) => sum + d.stories, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Stories (30 days)</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold text-secondary">
                  {monthlyData.reduce((sum, d) => sum + d.images, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Images (30 days)</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold text-accent">
                  {monthlyData.reduce((sum, d) => sum + d.chats, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Chats (30 days)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UsageHistoryChart;
