
import React, { useState } from 'react';
import { StoryParams } from '@/types/story';
import { useAuth } from '@clerk/clerk-react';
import { publishStoryToPublic } from './actions/StoryPublisher';
import { handleSaveStory } from './actions/StorySaver';

import GenerateButton from './buttons/GenerateButton';
import RandomizeButton from './buttons/RandomizeButton';
import SaveButton from './buttons/SaveButton';
import PublishButton from './buttons/PublishButton';
import ShareDropdown from './buttons/ShareDropdown';
import RefineButton from './buttons/RefineButton';
import ExportButton from './buttons/ExportButton';

interface StoryActionsProps {
  isGenerating: boolean;
  onGenerate: () => void;
  onRandomize: () => void;
  onRefine: (instruction: string) => void;
  storyTitle?: string;
  storyContent?: string;
  storyParams?: StoryParams;
}

const StoryActions: React.FC<StoryActionsProps> = ({
  isGenerating,
  onGenerate,
  onRandomize,
  onRefine,
  storyTitle = "",
  storyContent = "",
  storyParams
}) => {
  const { isSignedIn } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const handlePublish = () => {
    publishStoryToPublic(storyTitle, storyContent, isSignedIn, setIsPublishing);
  };

  const handleSave = () => {
    handleSaveStory(storyTitle, storyContent, isSignedIn, storyParams);
  };

  const isShareable = storyTitle !== "" && storyContent !== "";

  return (
    <div className="mt-6 space-y-4">
      <GenerateButton 
        isGenerating={isGenerating}
        onGenerate={onGenerate}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <RandomizeButton 
          isGenerating={isGenerating}
          onRandomize={onRandomize}
        />
        
        {isShareable && (
          <>
            <RefineButton onRefine={onRefine} disabled={isGenerating} />
            
            <ExportButton 
              title={storyTitle}
              content={storyContent}
              disabled={isGenerating}
            />
          </>
        )}
        
        <SaveButton
          isShareable={isShareable}
          isSignedIn={isSignedIn}
          onSave={handleSave}
        />
        
        <PublishButton
          isShareable={isShareable}
          isSignedIn={isSignedIn}
          isPublishing={isPublishing}
          onPublish={handlePublish}
        />
        
        <ShareDropdown
          isShareable={isShareable}
          storyTitle={storyTitle}
          storyContent={storyContent}
        />
      </div>

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
