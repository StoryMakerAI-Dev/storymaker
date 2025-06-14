
import { SharedStory } from '@/types/story';
import { toast } from "@/hooks/use-toast";

export const handleStoryAction = (
  action: string,
  storyId: string,
  stories: SharedStory[],
  setStories: (stories: SharedStory[]) => void,
  setSelectedStoryId: (id: string | null) => void,
  setIsCommenting: (value: boolean) => void,
  isSignedIn: boolean
) => {
  if (!isSignedIn) {
    toast({
      title: "Login required",
      description: `Please login to ${action.toLowerCase()} stories`,
      variant: "destructive",
    });
    return;
  }

  const updatedStories = stories.map(story => {
    if (story.id === storyId) {
      switch (action) {
        case 'Like':
          return { ...story, likes: story.likes + 1 };
        case 'Dislike':
          return { ...story, likes: Math.max(0, story.likes - 1) };
        case 'Comment':
          setSelectedStoryId(storyId);
          setIsCommenting(true);
          return story;
        case 'Share':
          return { ...story, shares: story.shares + 1 };
        default:
          return story;
      }
    }
    return story;
  });

  setStories(updatedStories);

  if (action !== 'Comment') {
    toast({
      title: `Story ${action}d!`,
      description: action === 'Like' ? "You liked this story" : 
                  action === 'Dislike' ? "You disliked this story" :
                  action === 'Share' ? "Story link copied to clipboard" : 
                  "Comment feature coming soon",
    });
  }

  if (action === 'Share') {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      const shareText = `Check out this story: "${story.title}" by ${story.author}`;
      navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
    }
  }
};
