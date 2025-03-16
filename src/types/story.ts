
export type StoryParams = {
  ageGroup: string;
  genre: string;
  characters: string;
  pronouns: string;
  setting: string;
  theme: string;
  additionalDetails: string;
};

export const initialStoryParams: StoryParams = {
  ageGroup: 'children',
  genre: 'fantasy',
  characters: '',
  pronouns: 'she/her',
  setting: '',
  theme: '',
  additionalDetails: '',
};

export type User = {
  email: string;
  username: string;
  password: string;
};
