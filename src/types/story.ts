
export type StoryParams = {
  ageGroup: string;
  genre: string;
  characters: string;
  numberOfCharacters?: number;
  pronouns: string;
  setting: string;
  theme: string;
  additionalDetails: string;
  famousCharacter?: string;
  wordCount?: number;
};

export const initialStoryParams: StoryParams = {
  ageGroup: 'children',
  genre: 'fantasy',
  characters: '',
  numberOfCharacters: 1,
  pronouns: 'they/them',
  setting: '',
  theme: '',
  additionalDetails: '',
  famousCharacter: '',
  wordCount: 0,
};

export type SavedStory = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  params: StoryParams;
};

export type User = {
  email: string;
  username: string;
  password: string;
  savedStories?: SavedStory[];
  profilePicture?: string;
};
