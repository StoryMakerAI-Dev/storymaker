
import { User, SavedStory } from "../types/story";

// Get users from localStorage or initialize empty array
export const getStoredUsers = (): User[] => {
  const storedUsers = localStorage.getItem('storyMakerUsers');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

// Store users in localStorage
export const storeUsers = (users: User[]) => {
  localStorage.setItem('storyMakerUsers', JSON.stringify(users));
};

// Check if a user is already logged in
export const getLoggedInUser = (): User | null => {
  const loggedInUser = localStorage.getItem('storyMakerCurrentUser');
  return loggedInUser ? JSON.parse(loggedInUser) : null;
};

// Save the current user to localStorage
export const saveCurrentUser = (user: User) => {
  localStorage.setItem('storyMakerCurrentUser', JSON.stringify(user));
};

// Remove the current user from localStorage
export const removeCurrentUser = () => {
  localStorage.removeItem('storyMakerCurrentUser');
};

// Save a story for the current user
export const saveStory = (story: SavedStory): boolean => {
  const currentUser = getLoggedInUser();
  if (!currentUser) return false;
  
  // Initialize savedStories array if it doesn't exist
  if (!currentUser.savedStories) {
    currentUser.savedStories = [];
  }
  
  // Check if story already exists (by id)
  const existingIndex = currentUser.savedStories.findIndex(s => s.id === story.id);
  if (existingIndex >= 0) {
    // Update existing story
    currentUser.savedStories[existingIndex] = story;
  } else {
    // Add new story
    currentUser.savedStories.push(story);
  }
  
  // Update user in localStorage
  saveCurrentUser(currentUser);
  
  // Also update user in users array
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.username === currentUser.username);
  if (userIndex >= 0) {
    users[userIndex] = currentUser;
    storeUsers(users);
  }
  
  return true;
};

// Get all saved stories for the current user
export const getSavedStories = (): SavedStory[] => {
  const currentUser = getLoggedInUser();
  if (!currentUser || !currentUser.savedStories) return [];
  return currentUser.savedStories;
};

// Delete a story by id
export const deleteStory = (storyId: string): boolean => {
  const currentUser = getLoggedInUser();
  if (!currentUser || !currentUser.savedStories) return false;
  
  currentUser.savedStories = currentUser.savedStories.filter(s => s.id !== storyId);
  
  // Update user in localStorage
  saveCurrentUser(currentUser);
  
  // Also update user in users array
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.username === currentUser.username);
  if (userIndex >= 0) {
    users[userIndex] = currentUser;
    storeUsers(users);
  }
  
  return true;
};
