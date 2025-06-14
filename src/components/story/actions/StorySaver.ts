
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { saveStory } from '@/utils/clerkAuthUtils';
import { StoryParams } from '@/types/story';

export const handleSaveStory = async (
  storyTitle: string,
  storyContent: string,
  isSignedIn: boolean,
  storyParams?: StoryParams
) => {
  if (!storyTitle || !storyContent || !isSignedIn) {
    return;
  }
  
  try {
    const savedStory = {
      id: uuidv4(),
      title: storyTitle,
      content: storyContent,
      createdAt: new Date().toISOString(),
      params: storyParams || {
        ageGroup: 'children',
        genre: 'fantasy',
        characters: '',
        pronouns: 'she/her',
        setting: '',
        theme: '',
        additionalDetails: '',
      }
    };
    
    const success = await saveStory(savedStory);
    if (success) {
      toast({
        title: "Story saved!",
        description: "Your story has been saved to your library",
      });
    } else {
      toast({
        title: "Save failed",
        description: "There was an error saving your story",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error saving story:", error);
    toast({
      title: "Save failed",
      description: "There was an error saving your story",
      variant: "destructive",
    });
  }
};
