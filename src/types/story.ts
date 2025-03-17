
export type StoryParams = {
  ageGroup: string;
  genre: string;
  characters: string;
  numberOfCharacters?: number;
  pronouns: string;
  setting: string;
  theme: string;
  additionalDetails: string;
};

export const initialStoryParams: StoryParams = {
  ageGroup: 'children',
  genre: 'fantasy',
  characters: '',
  numberOfCharacters: 1,
  pronouns: 'she/her',
  setting: '',
  theme: '',
  additionalDetails: '',
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
