
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { SavedStory } from '@/types/story';
import { getSavedStories, deleteStory } from '@/utils/clerkAuthUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@clerk/clerk-react';

interface SavedStoriesProps {
  onSelectStory: (story: SavedStory) => void;
}

const SavedStories: React.FC<SavedStoriesProps> = ({ onSelectStory }) => {
  const { toast } = useToast();
  const { isSignedIn } = useAuth();
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStories = async () => {
    setIsLoading(true);
    const savedStories = await getSavedStories();
    setStories(savedStories);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStories();
  }, [isSignedIn]);

  const handleDelete = async () => {
    if (storyToDelete) {
      const success = await deleteStory(storyToDelete);
      
      if (success) {
        setStories(stories.filter(story => story.id !== storyToDelete));
        toast({
          title: "Story deleted",
          description: "Your story has been deleted successfully",
        });
      } else {
        toast({
          title: "Delete failed",
          description: "There was an error deleting your story",
          variant: "destructive",
        });
      }
      
      setStoryToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your stories...</div>;
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't saved any stories yet.</p>
        <p className="mt-2 text-sm">Generate a story and use the Save button to add it to your collection.</p>
      </div>
    );
  }

  return (
    <div>
      <ScrollArea className="h-[400px] pr-3">
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="mb-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium" title={story.title}>
                {story.title.length > 30 
                  ? `${story.title.substring(0, 30)}...` 
                  : story.title}
              </h3>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => setStoryToDelete(story.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Story</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this story? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setStoryToDelete(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="mt-1 text-xs text-gray-500">
              {formatDate(story.createdAt)}
            </div>
            
            <p className="mt-2 text-sm text-gray-600">
              {story.content.substring(0, 100)}...
            </p>
            
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
              <span>{story.params.genre} • {story.params.ageGroup}</span>
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-storyforge-blue"
                onClick={() => onSelectStory(story)}
              >
                Load Story
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default SavedStories;
