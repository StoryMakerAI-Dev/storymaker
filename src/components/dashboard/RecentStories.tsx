import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getUserStories, SavedStoryData } from '@/services/supabase/storyService';
import { formatDistanceToNow } from 'date-fns';

const RecentStories: React.FC = () => {
  const { userId } = useAuth();
  const [stories, setStories] = useState<SavedStoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await getUserStories(userId);
      if (error) {
        console.error('Error fetching stories:', error);
      } else if (data) {
        setStories(data.slice(0, 3)); // Get only the 3 most recent
      }
      setLoading(false);
    };

    fetchStories();
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
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Recent Stories</CardTitle>
        </div>
        <CardDescription>
          Your latest creations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No stories yet. Start creating!</p>
          </div>
        ) : (
          <>
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="p-3 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary"
              >
                <h4 className="font-semibold mb-1 line-clamp-1">{story.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {story.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const element = document.getElementById('saved-stories');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View All Stories
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentStories;