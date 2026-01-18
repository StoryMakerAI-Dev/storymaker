import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Activity, Zap, Image, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface UsageLog {
  id: string;
  function_name: string;
  model_used: string;
  created_at: string;
}

interface DailyUsage {
  date: string;
  count: number;
}

interface FunctionUsage {
  name: string;
  count: number;
  color: string;
}

const FUNCTION_COLORS: Record<string, string> = {
  'generate-story': 'hsl(var(--primary))',
  'generate-story-image': 'hsl(var(--secondary))',
  'chat-assistant': 'hsl(var(--accent))',
};

const FUNCTION_LABELS: Record<string, string> = {
  'generate-story': 'Story Generation',
  'generate-story-image': 'Image Generation',
  'chat-assistant': 'Chat Assistant',
};

const AIUsageDashboard: React.FC = () => {
  const { userId } = useAuth();
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [functionUsage, setFunctionUsage] = useState<FunctionUsage[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [todayRequests, setTodayRequests] = useState(0);

  useEffect(() => {
    const fetchUsageLogs = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch usage logs for the last 30 days
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
        
        const { data, error } = await supabase
          .from('ai_usage_logs')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const logs = data || [];
        setUsageLogs(logs);
        setTotalRequests(logs.length);

        // Calculate today's requests
        const today = startOfDay(new Date());
        const todayLogs = logs.filter(log => new Date(log.created_at) >= today);
        setTodayRequests(todayLogs.length);

        // Calculate daily usage for the chart
        const dailyMap = new Map<string, number>();
        for (let i = 29; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'MMM dd');
          dailyMap.set(date, 0);
        }

        logs.forEach(log => {
          const date = format(new Date(log.created_at), 'MMM dd');
          if (dailyMap.has(date)) {
            dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
          }
        });

        setDailyUsage(Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count })));

        // Calculate function usage breakdown
        const functionMap = new Map<string, number>();
        logs.forEach(log => {
          const count = functionMap.get(log.function_name) || 0;
          functionMap.set(log.function_name, count + 1);
        });

        setFunctionUsage(Array.from(functionMap.entries()).map(([name, count]) => ({
          name: FUNCTION_LABELS[name] || name,
          count,
          color: FUNCTION_COLORS[name] || 'hsl(var(--muted))',
        })));

      } catch (error) {
        console.error('Error fetching usage logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageLogs();
  }, [userId]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            AI Usage Dashboard
          </CardTitle>
          <CardDescription>Sign in to view your AI usage statistics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>AI Usage Dashboard</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            Last 30 days
          </Badge>
        </div>
        <CardDescription>Track your AI model usage and activity over time</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Requests</span>
            </div>
            <p className="text-2xl font-bold text-primary">{totalRequests}</p>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">Today</span>
            </div>
            <p className="text-2xl font-bold text-secondary">{todayRequests}</p>
          </div>

          <div className="bg-accent/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Stories</span>
            </div>
            <p className="text-2xl font-bold text-accent-foreground">
              {usageLogs.filter(l => l.function_name === 'generate-story').length}
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Images</span>
            </div>
            <p className="text-2xl font-bold text-muted-foreground">
              {usageLogs.filter(l => l.function_name === 'generate-story-image').length}
            </p>
          </div>
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-4">
            <div className="h-64">
              {dailyUsage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }} 
                      interval="preserveStartEnd"
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No usage data yet. Start generating stories to see your activity!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="mt-4">
            <div className="h-64 flex items-center justify-center">
              {functionUsage.length > 0 ? (
                <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie
                        data={functionUsage}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {functionUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2">
                    {functionUsage.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">{entry.name}</span>
                        <Badge variant="outline" className="ml-auto">{entry.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  No usage data yet.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {usageLogs.slice(0, 10).length > 0 ? (
                usageLogs.slice(0, 10).map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {log.function_name === 'generate-story' && <Zap className="h-4 w-4 text-primary" />}
                      {log.function_name === 'generate-story-image' && <Image className="h-4 w-4 text-secondary" />}
                      {log.function_name === 'chat-assistant' && <MessageSquare className="h-4 w-4 text-accent-foreground" />}
                      <div>
                        <p className="text-sm font-medium">
                          {FUNCTION_LABELS[log.function_name] || log.function_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{log.model_used}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No recent activity. Start using AI features to see your history!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIUsageDashboard;
