import { User, SavedStory } from "../types/story";
import { 
  registerUser as firebaseRegister,
  loginUser as firebaseLogin,
  logoutUser as firebaseLogout,
  getCurrentUser,
  getUserData
} from "../services/firebase/authService";
import {
  saveStory as firebaseSaveStory,
  getSavedStories as firebaseGetSavedStories,
  deleteStory as firebaseDeleteStory
} from "../services/firebase/storyService";

// Local user cache
let currentUserCache: User | null = null;

// Get current user (with localStorage fallback for transition period)
export const getLoggedInUser = async (): Promise<User | null> => {
  // If we have a cached user, return it
  if (currentUserCache) return currentUserCache;
  
  // Try to get user from Firebase
  const firebaseUser = getCurrentUser();
  if (firebaseUser) {
    try {
      const userData = await getUserData(firebaseUser.uid);
      currentUserCache = userData;
      return userData;
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }
  
  // Fallback to localStorage during transition
  const loggedInUser = localStorage.getItem('storyMakerCurrentUser');
  return loggedInUser ? JSON.parse(loggedInUser) : null;
};

// For backward compatibility
export const getStoredUsers = (): User[] => {
  const storedUsers = localStorage.getItem('storyMakerUsers');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

// For backward compatibility
export const storeUsers = (users: User[]) => {
  localStorage.setItem('storyMakerUsers', JSON.stringify(users));
};

// Save the current user to cache
export const saveCurrentUser = (user: User) => {
  currentUserCache = user;
  // Also keep localStorage for backward compatibility
  localStorage.setItem('storyMakerCurrentUser', JSON.stringify(user));
};

// Remove the current user from cache
export const removeCurrentUser = () => {
  currentUserCache = null;
  localStorage.removeItem('storyMakerCurrentUser');
};

// Login user with Firebase
export const loginUserWithFirebase = async (email: string, password: string): Promise<User> => {
  const user = await firebaseLogin(email, password);
  saveCurrentUser(user);
  return user;
};

// Register user with Firebase
export const registerUserWithFirebase = async (email: string, username: string, password: string): Promise<User> => {
  const user = await firebaseRegister(email, password, username);
  saveCurrentUser(user);
  return user;
};

// Logout user with Firebase
export const logoutUserWithFirebase = async (): Promise<void> => {
  await firebaseLogout();
  removeCurrentUser();
};

// Save a story with Firebase
export const saveStory = async (story: SavedStory): Promise<boolean> => {
  return await firebaseSaveStory(story);
};

// Get all saved stories with Firebase
export const getSavedStories = async (): Promise<SavedStory[]> => {
  return await firebaseGetSavedStories();
};

// Delete a story with Firebase
export const deleteStory = async (storyId: string): Promise<boolean> => {
  return await firebaseDeleteStory(storyId);
};
