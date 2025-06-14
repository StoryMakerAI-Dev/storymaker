
import { toast } from "@/components/ui/use-toast";
import { validatePublishedStory } from '@/utils/story/validationUtils';

export const publishStoryToPublic = async (
  storyTitle: string,
  storyContent: string,
  isSignedIn: boolean,
  setIsPublishing: (value: boolean) => void
) => {
  if (!validatePublishedStory(storyTitle, storyContent)) {
    return;
  }
  
  if (!isSignedIn) {
    toast({
      title: "Login required",
      description: "Please login to publish stories",
      variant: "destructive",
    });
    return;
  }
  
  try {
    setIsPublishing(true);
    
    // Show message that publishing feature is in development
    toast({
      title: "Publishing feature coming soon!",
      description: "We're working hard to bring you the ability to publish stories to our community. For now, you can share stories directly with friends using the Share button.",
    });
    
  } catch (error) {
    console.error("Error publishing story:", error);
    toast({
      title: "Publishing failed",
      description: "There was an error publishing your story",
      variant: "destructive",
    });
  } finally {
    setIsPublishing(false);
  }
};
