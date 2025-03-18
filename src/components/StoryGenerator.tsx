
import React, { useState } from 'react';
import { BookText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';

import { StoryParams, initialStoryParams, SavedStory } from '@/types/story';
import { validateInputs, generateStoryContent } from '@/utils/storyUtils';

import StoryForm from './story/StoryForm';
import StoryActions from './story/StoryActions';
import ClerkAuthPanel from './auth/ClerkAuthPanel';

interface StoryGeneratorProps {
  onStoryGenerated: (story: string, title: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  storyTitle: string;
  storyContent: string;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ 
  onStoryGenerated, 
  isGenerating,
  setIsGenerating,
  storyTitle,
  storyContent
}) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [storyParams, setStoryParams] = useState<StoryParams>(initialStoryParams);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoryParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setStoryParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadSavedStory = (story: SavedStory) => {
    // Set the story parameters
    setStoryParams(story.params);
    
    // Generate the story directly from saved content
    onStoryGenerated(story.content, story.title);
  };

  const generateRandomStory = () => {
    const randomAgeGroups = ['children', 'teens', 'adults'];
    const randomGenres = ['fantasy', 'adventure', 'mystery', 'science-fiction', 'fairy-tale', 'historical'];
    const randomCharacters = [
      'a brave knight and a wise wizard',
      'a curious child and a mysterious stranger',
      'a talking animal and a magical creature',
      'a space explorer and an alien guide',
      'a detective and a reluctant witness',
      'a pirate captain and a royal advisor'
    ];
    const randomPronouns = ['she/her', 'he/him', 'they/them'];
    const randomSettings = [
      'enchanted forest',
      'floating islands in the sky',
      'abandoned space station',
      'underwater kingdom',
      'ancient ruins',
      'bustling medieval marketplace'
    ];
    const randomThemes = [
      'friendship and loyalty',
      'courage in the face of fear',
      'finding home in unexpected places',
      'the power of knowledge',
      'discovering one\'s true identity',
      'learning to trust others'
    ];

    const randomParams: StoryParams = {
      ageGroup: randomAgeGroups[Math.floor(Math.random() * randomAgeGroups.length)],
      genre: randomGenres[Math.floor(Math.random() * randomGenres.length)],
      characters: randomCharacters[Math.floor(Math.random() * randomCharacters.length)],
      pronouns: randomPronouns[Math.floor(Math.random() * randomPronouns.length)],
      setting: randomSettings[Math.floor(Math.random() * randomSettings.length)],
      theme: randomThemes[Math.floor(Math.random() * randomThemes.length)],
      additionalDetails: '',
    };

    setStoryParams(randomParams);
    
    generateStory(randomParams);
  };

  const generateStory = async (paramsToUse: StoryParams = storyParams) => {
    if (!validateInputs(paramsToUse)) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      setTimeout(() => {
        const { title, story } = generateStoryContent(paramsToUse);
        
        onStoryGenerated(story, title);
        setIsGenerating(false);
        
        toast({
          title: "Story created!",
          description: "Your unique story has been generated with grammar checking applied.",
        });
      }, 2000);
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const username = user?.username || user?.firstName || '';

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookText className="h-6 w-6 text-storyforge-blue" />
          <h2 className="text-2xl font-display font-bold text-gray-800">Story Generator</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <ClerkAuthPanel onLoadStory={handleLoadSavedStory} />
        </div>
      </div>
      
      <StoryForm 
        storyParams={storyParams}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />
      
      <StoryActions 
        isGenerating={isGenerating}
        onGenerate={() => generateStory()}
        onRandomize={generateRandomStory}
        storyTitle={storyTitle}
        storyContent={storyContent}
        storyParams={storyParams}
      />
    </div>
  );
};

export default StoryGenerator;
