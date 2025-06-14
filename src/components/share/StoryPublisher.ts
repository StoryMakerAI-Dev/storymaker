
import { SharedStory } from '@/types/story';
import { toast } from "@/hooks/use-toast";

export const handlePostStory = (
  newStoryTitle: string,
  newStoryContent: string,
  isSignedIn: boolean,
  userId: string | null | undefined,
  stories: SharedStory[],
  setStories: (stories: SharedStory[]) => void,
  setNewStoryTitle: (title: string) => void,
  setNewStoryContent: (content: string) => void,
  setIsDialogOpen: (open: boolean) => void
) => {
  if (!isSignedIn) {
    toast({
      title: "Login required",
      description: "Please login to post stories",
      variant: "destructive",
    });
    return;
  }

  if (!newStoryTitle.trim() || !newStoryContent.trim()) {
    toast({
      title: "Missing information",
      description: "Please provide both a title and content for your story",
      variant: "destructive",
    });
    return;
  }

  const newStory: SharedStory = {
    id: `story-${Date.now()}`,
    title: newStoryTitle,
    content: newStoryContent,
    createdAt: new Date().toISOString(),
    author: "You",
    authorId: userId || "unknown",
    isPublic: true,
    likes: 0,
    comments: 0,
    shares: 0,
    params: {
      ageGroup: "Adults",
      genre: "Fantasy",
      characters: "",
      pronouns: "",
      setting: "",
      theme: "",
      additionalDetails: "",
    }
  };

  setStories([newStory, ...stories]);
  setNewStoryTitle("");
  setNewStoryContent("");
  setIsDialogOpen(false);

  toast({
    title: "Story posted!",
    description: "Your story has been published successfully",
  });
};
