
import React, { useState } from 'react';
import { StoryParams } from '@/types/story';
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { saveStory } from '@/utils/clerkAuthUtils';
import { validatePublishedStory } from '@/utils/story/validationUtils';

import GenerateButton from './buttons/GenerateButton';
import RandomizeButton from './buttons/RandomizeButton';
import SaveButton from './buttons/SaveButton';
import PublishButton from './buttons/PublishButton';
import ShareDropdown from './buttons/ShareDropdown';

interface StoryActionsProps {
  isGenerating: boolean;
  onGenerate: () => void;
  onRandomize: () => void;
  storyTitle?: string;
  storyContent?: string;
  storyParams?: StoryParams;
}

const StoryActions: React.FC<StoryActionsProps> = ({
  isGenerating,
  onGenerate,
  onRandomize,
  storyTitle = "",
  storyContent = "",
  storyParams
}) => {
  const { isSignedIn } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  
  const publishStoryToPublic = async () => {
    // Basic validation is now handled in the PublishButton component
    if (!validatePublishedStory(storyTitle, storyContent)) {
      return;
    }
    
    if (!isSignedIn) {
      toast({
        title: "Login required",
        description: "Please login to publish stories",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsPublishing(true);
      
      // Show message that publishing feature is in development
      toast({
        title: "Publishing feature coming soon!",
        description: "We're working hard to bring you the ability to publish stories to our community. For now, you can share stories directly with friends using the Share button.",
      });
      
    } catch (error) {
      console.error("Error publishing story:", error);
      toast({
        title: "Publishing failed",
        description: "There was an error publishing your story",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveStory = async () => {
    if (!storyTitle || !storyContent || !isSignedIn) {
      return; // Basic validation is now handled in the SaveButton component
    }
    
    try {
      const savedStory = {
        id: uuidv4(),
        title: storyTitle,
        content: storyContent,
        createdAt: new Date().toISOString(),
        params: storyParams || {
          ageGroup: 'children',
          genre: 'fantasy',
          characters: '',
          pronouns: 'she/her',
          setting: '',
          theme: '',
          additionalDetails: '',
        }
      };
      
      const success = await saveStory(savedStory);
      if (success) {
        toast({
          title: "Story saved!",
          description: "Your story has been saved to your library",
        });
      } else {
        toast({
          title: "Save failed",
          description: "There was an error saving your story",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your story",
        variant: "destructive",
      });
    }
  };

  const isShareable = storyTitle !== "" && storyContent !== "";

  return (
    <div className="mt-6 space-y-4">
      {/* Main action button - Generate Story */}
      <GenerateButton 
        isGenerating={isGenerating}
        onGenerate={onGenerate}
      />
      
      {/* Secondary action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <RandomizeButton 
          isGenerating={isGenerating}
          onRandomize={onRandomize}
        />
        
        <SaveButton
          isShareable={isShareable}
          isSignedIn={isSignedIn}
          onSave={handleSaveStory}
        />
        
        <PublishButton
          isShareable={isShareable}
          isSignedIn={isSignedIn}
          isPublishing={isPublishing}
          onPublish={publishStoryToPublic}
        />
        
        <ShareDropdown
          isShareable={isShareable}
          storyTitle={storyTitle}
          storyContent={storyContent}
        />
      </div>

      {/* Mobile optimization */}
      <style>{`
        @media (max-width: 640px) {
          .dropdown-button {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StoryActions;
