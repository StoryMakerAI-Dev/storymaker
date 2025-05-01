
import React from 'react';
import { StoryParams } from '@/types/story';
import CharacterInputSection from './CharacterInputSection';
import PronounManagement from './PronounManagement';
import StoryBasicFields from './StoryBasicFields';

interface StoryFormProps {
  storyParams: StoryParams;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const StoryForm: React.FC<StoryFormProps> = ({
  storyParams,
  handleInputChange,
  handleSelectChange
}) => {
  const handleCharacterChange = (characters: string) => {
    const event = {
      target: {
        name: 'characters',
        value: characters
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(event);
  };

  return (
    <>
      <StoryBasicFields
        ageGroup={storyParams.ageGroup}
        genre={storyParams.genre}
        setting={storyParams.setting}
        theme={storyParams.theme}
        additionalDetails={storyParams.additionalDetails}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />
      
      <div className="space-y-4 mt-6">
        <CharacterInputSection
          characters={storyParams.characters}
          onCharacterChange={handleCharacterChange}
        />
        
        <PronounManagement
          numberOfCharacters={storyParams.numberOfCharacters || 1}
          pronouns={storyParams.pronouns}
          onPronounsChange={(value) => handleSelectChange('pronouns', value)}
          onNumberOfCharactersChange={(value) => handleSelectChange('numberOfCharacters', value)}
        />
      </div>
    </>
  );
};

export default StoryForm;
