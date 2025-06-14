
import { toast } from "@/hooks/use-toast";

export interface StoryComment {
  id: string;
  storyId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export const handlePostComment = (
  newComment: string,
  selectedStoryId: string | null,
  isSignedIn: boolean,
  userId: string | null | undefined,
  comments: StoryComment[],
  setComments: (comments: StoryComment[]) => void,
  stories: any[],
  setStories: (stories: any[]) => void,
  setNewComment: (comment: string) => void,
  setIsCommenting: (value: boolean) => void
) => {
  if (!isSignedIn) {
    toast({
      title: "Login required",
      description: "Please login to comment",
      variant: "destructive",
    });
    return;
  }

  if (!newComment.trim() || !selectedStoryId) {
    toast({
      title: "Missing information",
      description: "Please enter a comment",
      variant: "destructive",
    });
    return;
  }

  const comment: StoryComment = {
    id: `comment-${Date.now()}`,
    storyId: selectedStoryId,
    author: "You",
    authorId: userId || "unknown",
    content: newComment,
    createdAt: new Date().toISOString()
  };

  setComments([...comments, comment]);

  const updatedStories = stories.map(story => {
    if (story.id === selectedStoryId) {
      return { ...story, comments: story.comments + 1 };
    }
    return story;
  });
  setStories(updatedStories);

  setNewComment("");
  setIsCommenting(false);

  toast({
    title: "Comment posted!",
    description: "Your comment has been added successfully",
  });
};
