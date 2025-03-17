
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { SavedStory } from '@/types/story';

// Save a story
export const saveStory = async (story: SavedStory): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    // Check if story already exists
    const q = query(
      collection(db, "stories"), 
      where("id", "==", story.id),
      where("userId", "==", user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Add new story
      await addDoc(collection(db, "stories"), {
        ...story,
        userId: user.uid
      });
    } else {
      // Update existing story
      const storyDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "stories", storyDoc.id), story);
    }
    
    return true;
  } catch (error) {
    console.error("Error saving story:", error);
    return false;
  }
};

// Get all stories for current user
export const getSavedStories = async (): Promise<SavedStory[]> => {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    
    const q = query(
      collection(db, "stories"), 
      where("userId", "==", user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as SavedStory);
    
  } catch (error) {
    console.error("Error getting stories:", error);
    return [];
  }
};

// Delete a story
export const deleteStory = async (storyId: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    
    const q = query(
      collection(db, "stories"), 
      where("id", "==", storyId),
      where("userId", "==", user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const storyDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "stories", storyDoc.id));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting story:", error);
    return false;
  }
};
