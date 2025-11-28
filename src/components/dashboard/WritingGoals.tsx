import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, Trophy } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getActiveGoals, createGoal, WritingGoal } from '@/services/supabase/goalsService';
import { toast } from '@/hooks/use-toast';

const WritingGoals: React.FC = () => {
  const { userId } = useAuth();
  const [goals, setGoals] = useState<WritingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goalType, setGoalType] = useState<'daily' | 'weekly'>('daily');
  const [targetCount, setTargetCount] = useState('5');

  const fetchGoals = async () => {
    if (!userId) return;

    const { data, error } = await getActiveGoals(userId);
    if (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch writing goals',
        variant: 'destructive',
      });
    } else if (data) {
      setGoals(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const handleCreateGoal = async () => {
    if (!userId) return;

    const count = parseInt(targetCount);
    if (isNaN(count) || count <= 0) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a valid target count',
        variant: 'destructive',
      });
      return;
    }

    const { data, error } = await createGoal(userId, goalType, count);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create goal',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Goal created!',
        description: `Your ${goalType} writing goal has been set`,
      });
      setIsDialogOpen(false);
      fetchGoals();
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            <CardTitle>Writing Goals</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Writing Goal</DialogTitle>
                <DialogDescription>
                  Set a goal to track your writing progress
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Goal Type</Label>
                  <Select value={goalType} onValueChange={(value: 'daily' | 'weekly') => setGoalType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Stories</Label>
                  <Input 
                    type="number" 
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateGoal}>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Track your progress towards writing goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No active goals. Create one to start tracking!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.current_count / goal.target_count) * 100;
            const isComplete = goal.current_count >= goal.target_count;
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize flex items-center gap-2">
                    {goal.goal_type} Goal
                    {isComplete && <Trophy className="h-4 w-4 text-accent" />}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {goal.current_count} / {goal.target_count} stories
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                {isComplete && (
                  <p className="text-sm text-accent font-medium">🎉 Goal achieved!</p>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default WritingGoals;