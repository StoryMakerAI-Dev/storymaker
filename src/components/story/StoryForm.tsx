
import React from 'react';
import { StoryParams } from '@/types/story';
import CharacterInputSection from './CharacterInputSection';
import PronounManagement from './PronounManagement';
import StoryBasicFields from './StoryBasicFields';
import FontSelector from './FontSelector';

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

  const handleWordCountChange = (value: number) => {
    handleSelectChange('wordCount', value.toString());
  };

  return (
    <>
      <StoryBasicFields
        ageGroup={storyParams.ageGroup}
        genre={storyParams.genre}
        contentType={storyParams.contentType || 'story'}
        setting={storyParams.setting}
        theme={storyParams.theme}
        additionalDetails={storyParams.additionalDetails}
        wordCount={storyParams.wordCount}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onWordCountChange={handleWordCountChange}
      />
      
      <FontSelector
        selectedFont={storyParams.font || 'crimson'}
        onFontChange={(font) => handleSelectChange('font', font)}
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
