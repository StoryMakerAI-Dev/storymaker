
import { useUser, useAuth } from "@clerk/clerk-react";
import { User, SavedStory } from "@/types/story";

// Get current user
export const useCurrentUser = (): User | null => {
  const { user } = useUser();
  
  if (!user) return null;
  
  return {
    email: user.primaryEmailAddress?.emailAddress || "",
    username: user.username || user.firstName || "User",
    password: "", // Clerk handles passwords, this is just for type compatibility
    savedStories: []
  };
};

// Check if user is logged in
export const useIsLoggedIn = (): boolean => {
  const { isLoaded, isSignedIn } = useAuth();
  return isLoaded && !!isSignedIn;
};

// Save a story
export const saveStory = async (story: SavedStory): Promise<boolean> => {
  try {
    // Store in localStorage temporarily
    // In a real app, you'd use Clerk's user metadata or a separate database
    const { user } = useAuth();
    if (!user) return false;
    
    const userId = user.id;
    const storiesKey = `stories_${userId}`;
    
    let stories: SavedStory[] = [];
    const savedStories = localStorage.getItem(storiesKey);
    if (savedStories) {
      stories = JSON.parse(savedStories);
    }
    
    // Check if story already exists
    const existingIndex = stories.findIndex(s => s.id === story.id);
    if (existingIndex >= 0) {
      stories[existingIndex] = story;
    } else {
      stories.push(story);
    }
    
    localStorage.setItem(storiesKey, JSON.stringify(stories));
    return true;
  } catch (error) {
    console.error("Error saving story:", error);
    return false;
  }
};

// Get all saved stories
export const getSavedStories = (): SavedStory[] => {
  try {
    const { user } = useAuth();
    if (!user) return [];
    
    const userId = user.id;
    const storiesKey = `stories_${userId}`;
    
    const savedStories = localStorage.getItem(storiesKey);
    return savedStories ? JSON.parse(savedStories) : [];
  } catch (error) {
    console.error("Error getting stories:", error);
    return [];
  }
};

// Delete a story
export const deleteStory = async (storyId: string): Promise<boolean> => {
  try {
    const { user } = useAuth();
    if (!user) return false;
    
    const userId = user.id;
    const storiesKey = `stories_${userId}`;
    
    const savedStories = localStorage.getItem(storiesKey);
    if (!savedStories) return false;
    
    let stories: SavedStory[] = JSON.parse(savedStories);
    stories = stories.filter(s => s.id !== storyId);
    
    localStorage.setItem(storiesKey, JSON.stringify(stories));
    return true;
  } catch (error) {
    console.error("Error deleting story:", error);
    return false;
  }
};
