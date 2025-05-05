
import { StoryParams } from "../../types/story";
import { toast } from '@/components/ui/use-toast';

export const validateInputs = (params: StoryParams): boolean => {
  if (!params.characters || !params.characters.trim()) {
    toast({
      title: "Missing information",
      description: "Please provide main characters for your story.",
      variant: "destructive",
    });
    return false;
  }
  
  if (!params.setting || !params.setting.trim()) {
    toast({
      title: "Missing information",
      description: "Please provide a setting for your story.",
      variant: "destructive",
    });
    return false;
  }
  
  if (!params.theme || !params.theme.trim()) {
    toast({
      title: "Missing information",
      description: "Please provide a theme or lesson for your story.",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

// Add a utility function to validate published stories
export const validatePublishedStory = (title: string, content: string): boolean => {
  if (!title || !title.trim()) {
    toast({
      title: "Cannot publish",
      description: "Your story needs a title",
      variant: "destructive",
    });
    return false;
  }
  
  if (!content || !content.trim() || content.length < 100) {
    toast({
      title: "Cannot publish",
      description: "Your story content is too short to publish",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};
