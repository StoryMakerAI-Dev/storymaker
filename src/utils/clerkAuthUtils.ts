
import { SavedStory } from '@/types/story';

// Local storage keys for stories
const STORIES_STORAGE_KEY = 'storyMakerSavedStories';

// Get saved stories from localStorage
export const getSavedStories = async (): Promise<SavedStory[]> => {
  const storedStories = localStorage.getItem(STORIES_STORAGE_KEY);
  return storedStories ? JSON.parse(storedStories) : [];
};

// Save a story to localStorage
export const saveStory = async (story: SavedStory): Promise<boolean> => {
  try {
    const existingStories = await getSavedStories();
    
    // Check if story with same ID exists
    const storyIndex = existingStories.findIndex(s => s.id === story.id);
    
    if (storyIndex >= 0) {
      // Update existing story
      existingStories[storyIndex] = story;
    } else {
      // Add new story
      existingStories.push(story);
    }
    
    // Save to localStorage
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(existingStories));
    return true;
  } catch (error) {
    console.error("Error saving story:", error);
    return false;
  }
};

// Delete a story from localStorage
export const deleteStory = async (storyId: string): Promise<boolean> => {
  try {
    const existingStories = await getSavedStories();
    const updatedStories = existingStories.filter(story => story.id !== storyId);
    
    // Save updated stories to localStorage
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
    return true;
  } catch (error) {
    console.error("Error deleting story:", error);
    return false;
  }
};

// Get user information using Clerk - this will be used by components that need user data
export const getLoggedInUser = () => {
  // This function is now a placeholder - components should use Clerk's useUser hook directly
  return null;
};
