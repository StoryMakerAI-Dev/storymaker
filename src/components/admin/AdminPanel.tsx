import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';
import { toast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Shield, Users, Activity, Settings, TrendingUp, Crown, Zap, Image, MessageSquare, AlertTriangle } from 'lucide-react';

interface OverviewStats {
  totalRequests: number;
  todayRequests: number;
  uniqueUsers: number;
  functionBreakdown: Record<string, number>;
  tierDistribution: Record<string, number>;
  dailyUsage: { date: string; count: number }[];
}

interface UserStats {
  userId: string;
  totalRequests: number;
  storyRequests: number;
  imageRequests: number;
  chatRequests: number;
  lastActivity?: string;
  tier?: string;
  preferredModel?: string;
  emailNotifications?: boolean;
}

interface TierConfig {
  id: string;
  tier: string;
  display_name: string;
  story_limit_per_day: number;
  image_limit_per_day: number;
  chat_limit_per_day: number;
  story_limit_per_month: number;
  image_limit_per_month: number;
  chat_limit_per_month: number;
}

const TIER_COLORS: Record<string, string> = {
  free: 'hsl(var(--muted))',
  basic: 'hsl(var(--primary))',
  pro: 'hsl(var(--secondary))',
  enterprise: 'hsl(var(--accent))',
};

const FUNCTION_COLORS: Record<string, string> = {
  'generate-story': 'hsl(var(--primary))',
  'generate-story-image': 'hsl(var(--secondary))',
  'chat-assistant': 'hsl(var(--accent))',
};

const AdminPanel: React.FC = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newTier, setNewTier] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAdminAndFetch();
  }, [userId]);

  const checkAdminAndFetch = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Check admin status using the edge function
      const { data, error } = await supabase.functions.invoke('admin-stats', {
        body: {},
        headers: { 'x-user-id': userId },
      });

      if (error?.message?.includes('403') || error?.message?.includes('Forbidden')) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      setOverview(data);

      // Fetch users and tiers
      await Promise.all([fetchUsers(), fetchTiers()]);
    } catch (error: any) {
      if (error?.message?.includes('403')) {
        setIsAdmin(false);
      }
      console.error('Error checking admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-stats', {
        body: {},
        headers: { 'x-user-id': userId || '' },
      });

      // Re-fetch with users action
      const usersResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats?action=users`,
        {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTiers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats?action=tiers`,
        {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (response.ok) {
        const tiersData = await response.json();
        setTiers(tiersData.tiers || []);
      }
    } catch (error) {
      console.error('Error fetching tiers:', error);
    }
  };

  const handleUpdateUserTier = async () => {
    if (!selectedUser || !newTier) {
      toast({ title: 'Please select a user and tier', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats?action=update-tier`,
        {
          method: 'POST',
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetUserId: selectedUser, newTier }),
        }
      );

      if (response.ok) {
        toast({ title: 'User tier updated successfully' });
        fetchUsers();
        setSelectedUser('');
        setNewTier('');
      } else {
        throw new Error('Failed to update tier');
      }
    } catch (error) {
      console.error('Error updating tier:', error);
      toast({ title: 'Failed to update tier', variant: 'destructive' });
    }
  };

  const handleUpdateTierConfig = async (tier: string, field: string, value: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats?action=update-tier-config`,
        {
          method: 'POST',
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tier, [field]: value }),
        }
      );

      if (response.ok) {
        toast({ title: 'Tier configuration updated' });
        fetchTiers();
      }
    } catch (error) {
      console.error('Error updating tier config:', error);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
          </div>
          <CardDescription>You don't have admin privileges to access this panel.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const filteredUsers = users.filter(user =>
    user.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const functionData = overview?.functionBreakdown
    ? Object.entries(overview.functionBreakdown).map(([name, count]) => ({
        name: name.replace('generate-', '').replace('-', ' '),
        count,
        color: FUNCTION_COLORS[name] || 'hsl(var(--muted))',
      }))
    : [];

  const tierData = overview?.tierDistribution
    ? Object.entries(overview.tierDistribution).map(([name, count]) => ({
        name,
        count,
        color: TIER_COLORS[name] || 'hsl(var(--muted))',
      }))
    : [];

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Admin Panel</CardTitle>
          </div>
          <Badge variant="default" className="bg-gradient-to-r from-primary to-secondary">
            Administrator
          </Badge>
        </div>
        <CardDescription>Manage users, view usage statistics, and configure rate limits</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tiers" className="flex items-center gap-1">
              <Crown className="h-4 w-4" />
              Tiers
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Requests</span>
                </div>
                <p className="text-2xl font-bold text-primary">{overview?.totalRequests || 0}</p>
              </div>
              <div className="bg-secondary/10 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">Today</span>
                </div>
                <p className="text-2xl font-bold text-secondary">{overview?.todayRequests || 0}</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-accent-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Active Users</span>
                </div>
                <p className="text-2xl font-bold text-accent-foreground">{overview?.uniqueUsers || 0}</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Tiers</span>
                </div>
                <p className="text-2xl font-bold text-muted-foreground">{Object.keys(overview?.tierDistribution || {}).length}</p>
              </div>
            </div>

            {/* Usage Chart */}
            <div className="h-72">
              <h3 className="text-sm font-semibold mb-4">Daily Usage (Last 30 Days)</h3>
              {overview?.dailyUsage && overview.dailyUsage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overview.dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No usage data available
                </div>
              )}
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-4">Function Distribution</h3>
                <div className="h-48">
                  {functionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={functionData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No data
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Tier Distribution</h3>
                <div className="h-48 flex items-center justify-center">
                  {tierData.length > 0 ? (
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width={150} height={150}>
                        <PieChart>
                          <Pie
                            data={tierData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            dataKey="count"
                          >
                            {tierData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col gap-2">
                        {tierData.map((entry) => (
                          <div key={entry.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm capitalize">{entry.name}</span>
                            <Badge variant="outline">{entry.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No data</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6 space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Stories</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Chat</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice(0, 20).map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-mono text-xs">{user.userId.slice(0, 16)}...</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.tier || 'free'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.totalRequests}</TableCell>
                      <TableCell>{user.storyRequests}</TableCell>
                      <TableCell>{user.imageRequests}</TableCell>
                      <TableCell>{user.chatRequests}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user.userId)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {selectedUser && (
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-4">Update User Tier</h4>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono">{selectedUser.slice(0, 20)}...</span>
                  <Select value={newTier} onValueChange={setNewTier}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleUpdateUserTier}>Update</Button>
                  <Button variant="ghost" onClick={() => setSelectedUser('')}>Cancel</Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tiers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiers.map((tier) => (
                <Card key={tier.id} className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5" style={{ color: TIER_COLORS[tier.tier] }} />
                    <h3 className="font-semibold capitalize">{tier.display_name}</h3>
                    <Badge variant="outline" className="ml-auto">{tier.tier}</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Stories/Day</span>
                      <Input
                        type="number"
                        value={tier.story_limit_per_day}
                        onChange={(e) => handleUpdateTierConfig(tier.tier, 'story_limit_per_day', Number(e.target.value))}
                        className="w-20 text-right"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Images/Day</span>
                      <Input
                        type="number"
                        value={tier.image_limit_per_day}
                        onChange={(e) => handleUpdateTierConfig(tier.tier, 'image_limit_per_day', Number(e.target.value))}
                        className="w-20 text-right"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Chat/Day</span>
                      <Input
                        type="number"
                        value={tier.chat_limit_per_day}
                        onChange={(e) => handleUpdateTierConfig(tier.tier, 'chat_limit_per_day', Number(e.target.value))}
                        className="w-20 text-right"
                      />
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Stories/Month</span>
                        <Input
                          type="number"
                          value={tier.story_limit_per_month}
                          onChange={(e) => handleUpdateTierConfig(tier.tier, 'story_limit_per_month', Number(e.target.value))}
                          className="w-20 text-right"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Admin Settings</h3>
              <p className="text-muted-foreground text-sm">
                Additional admin configuration options will be available here.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
