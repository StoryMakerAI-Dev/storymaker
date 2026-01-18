
import React, { useState, useEffect } from 'react';
import { BookText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';

import { StoryParams, initialStoryParams, SavedStory } from '@/types/story';
import { validateInputs } from '@/utils/storyUtils';
import { supabase } from '@/integrations/supabase/client';
import { saveStory } from '@/services/supabase/storyService';
import { getUserPreferences, updatePreferredModel } from '@/services/supabase/preferencesService';

import StoryForm from './story/StoryForm';
import StoryActions from './story/StoryActions';
import ClerkAuthPanel from './auth/ClerkAuthPanel';
import AIModelSelector from './story/AIModelSelector';

interface StoryGeneratorProps {
  onStoryGenerated: (story: string, title: string, imageUrl?: string, storyId?: string, font?: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  storyTitle: string;
  storyContent: string;
  currentStoryId?: string;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ 
  onStoryGenerated, 
  isGenerating,
  setIsGenerating,
  storyTitle,
  storyContent,
  currentStoryId
}) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [storyParams, setStoryParams] = useState<StoryParams>(initialStoryParams);
  const [selectedAIModel, setSelectedAIModel] = useState<string>('google/gemini-2.5-flash');

  // Load user's preferred AI model
  useEffect(() => {
    const loadPreferences = async () => {
      if (user?.id) {
        const prefs = await getUserPreferences(user.id);
        if (prefs?.preferred_ai_model) {
          setSelectedAIModel(prefs.preferred_ai_model);
        }
      }
    };
    loadPreferences();
  }, [user?.id]);

  const handleModelChange = async (model: string) => {
    setSelectedAIModel(model);
    if (user?.id) {
      await updatePreferredModel(user.id, model);
    }
  };
  
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

  const generateStory = async (paramsToUse: StoryParams = storyParams, refinementInstruction?: string, parentId?: string) => {
    if (!validateInputs(paramsToUse)) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get user ID for rate limiting
      const userId = user?.id || 'anonymous';
      
      // Generate story text with selected AI model
      const { data: storyData, error: storyError } = await supabase.functions.invoke('generate-story', {
        body: {
          characters: paramsToUse.characters,
          setting: paramsToUse.setting,
          theme: paramsToUse.theme,
          ageGroup: paramsToUse.ageGroup,
          pronouns: paramsToUse.pronouns,
          wordCount: paramsToUse.wordCount,
          genre: paramsToUse.genre || 'fantasy',
          model: selectedAIModel,
          existingStory: refinementInstruction ? storyContent : undefined,
          refinementInstruction
        },
        headers: {
          'x-user-id': userId
        }
      });

      if (storyError) throw storyError;
      if (storyData?.error) throw new Error(storyData.error);

      // Generate cover image
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-story-image', {
        body: {
          title: storyData.title,
          characters: paramsToUse.characters,
          setting: paramsToUse.setting,
          ageGroup: paramsToUse.ageGroup
        },
        headers: {
          'x-user-id': userId
        }
      });

      const coverImageUrl = imageData?.imageUrl;

      // Save to database if user is logged in
      let savedStoryId: string | undefined;
      if (user) {
        const userId = user.id;
        const { data: savedData, error: saveError } = await saveStory(
          userId,
          storyData.title,
          storyData.story,
          paramsToUse,
          coverImageUrl,
          parentId || currentStoryId
        );

        if (!saveError && savedData) {
          savedStoryId = savedData.id;
        }
      }

      onStoryGenerated(storyData.story, storyData.title, coverImageUrl, savedStoryId, paramsToUse.font);
      
      toast({
        title: refinementInstruction ? "Story refined!" : "Story created!",
        description: refinementInstruction 
          ? "Your story has been refined with AI."
          : "Your AI-powered story has been generated with a custom cover image.",
      });
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = (instruction: string) => {
    if (!storyContent || !storyTitle) {
      toast({
        title: "No story to refine",
        description: "Generate a story first before refining it.",
        variant: "destructive",
      });
      return;
    }
    generateStory(storyParams, instruction, currentStoryId);
  };

  const username = user?.username || user?.firstName || '';

  return (
    <div className="w-full max-w-3xl mx-auto p-8 glass-card rounded-2xl shadow-xl story-card-hover animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-storyforge-blue to-storyforge-purple rounded-xl">
            <BookText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-800">Story Generator</h2>
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
      
      <div className="my-6">
        <AIModelSelector 
          selectedModel={selectedAIModel}
          onModelChange={handleModelChange}
        />
      </div>
      
      <StoryActions
        isGenerating={isGenerating}
        onGenerate={() => generateStory()}
        onRandomize={generateRandomStory}
        onRefine={handleRefine}
        storyTitle={storyTitle}
        storyContent={storyContent}
        storyParams={storyParams}
      />
    </div>
  );
};

export default StoryGenerator;
