
export type StoryParams = {
  ageGroup: string;
  genre: string;
  contentType?: 'story' | 'poem';
  characters: string;
  numberOfCharacters?: number;
  pronouns: string;
  setting: string;
  theme: string;
  additionalDetails: string;
  famousCharacter?: string;
  wordCount?: number;
  font?: string;
  modelUsed?: string;
};

export const initialStoryParams: StoryParams = {
  ageGroup: 'children',
  genre: 'fantasy',
  contentType: 'story',
  characters: '',
  numberOfCharacters: 1,
  pronouns: 'they/them',
  setting: '',
  theme: '',
  additionalDetails: '',
  famousCharacter: '',
  wordCount: 0,
  font: 'crimson',
};

export type SavedStory = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  params: StoryParams;
};

export type SharedStory = SavedStory & {
  author: string;
  authorId: string;
  isPublic: boolean;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[];
};

export type User = {
  email: string;
  username: string;
  password: string;
  savedStories?: SavedStory[];
  profilePicture?: string;
};
