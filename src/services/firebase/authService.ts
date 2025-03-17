
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  UserCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User } from '@/types/story';

// Register a new user
export const registerUser = async (email: string, password: string, username: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    
    // Create user document in Firestore
    const user: User = {
      email,
      username,
      password: "", // Don't store password in Firestore for security
      savedStories: []
    };
    
    await setDoc(doc(db, "users", userCredential.user.uid), user);
    return user;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await getUserData(userCredential.user.uid);
  } catch (error) {
    throw error;
  }
};

// Get current user data
export const getUserData = async (userId: string): Promise<User> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    throw new Error("User not found");
  }
};

// Get current user from Firebase Auth
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  return await signOut(auth);
};

// Check if email is verified
export const isEmailVerified = (): boolean => {
  const user = auth.currentUser;
  return user !== null && user.emailVerified;
};

// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};
