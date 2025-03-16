
import { User } from "../types/story";

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
