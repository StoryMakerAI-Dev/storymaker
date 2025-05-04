
import { StoryParams } from "../../types/story";

export const generateMockTitle = (params: StoryParams): string => {
  const mainCharacter = params.characters.split(' and ')[0] || params.characters.split(',')[0] || "Hero";
  const cleanedMainCharacter = mainCharacter.trim().replace(/^a |^an |^the /i, '');
  const setting = params.setting || "Magical Land";
  
  const titlePrefixes = [
    "The Adventure of",
    "The Tale of",
    "The Journey of",
    "The Quest of",
    "The Story of"
  ];
  
  const titleConnectors = [
    "in the",
    "and the",
    "of the",
    "beyond the"
  ];
  
  const prefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  const connector = titleConnectors[Math.floor(Math.random() * titleConnectors.length)];
  
  return `${prefix} ${cleanedMainCharacter} ${connector} ${setting}`;
};
