
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PronounSelector from '../PronounSelector';
import { StoryParams } from '@/types/story';
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Plus } from 'lucide-react';

interface StoryFormProps {
  storyParams: StoryParams;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const famousCharacters = [
  { name: "Albert Einstein", description: "Brilliant physicist and Nobel Prize winner" },
  { name: "Marie Curie", description: "Pioneering scientist and two-time Nobel Prize winner" },
  { name: "Leonardo da Vinci", description: "Renaissance polymath, artist, and inventor" },
  { name: "William Shakespeare", description: "Legendary playwright and poet" },
  { name: "Cleopatra", description: "Last active ruler of the Ptolemaic Kingdom of Egypt" },
  { name: "Amelia Earhart", description: "Aviation pioneer and author" }
];

const StoryForm: React.FC<StoryFormProps> = ({
  storyParams,
  handleInputChange,
  handleSelectChange
}) => {
  const [customCharacter, setCustomCharacter] = useState('');

  const handleAddFamousCharacter = (character: string) => {
    const currentCharacters = storyParams.characters;
    const newCharacters = currentCharacters 
      ? `${currentCharacters}, ${character}` 
      : character;
    
    const event = {
      target: {
        name: 'characters',
        value: newCharacters
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(event);
  };

  const handleAddCustomCharacter = () => {
    if (customCharacter.trim()) {
      handleAddFamousCharacter(customCharacter.trim());
      setCustomCharacter('');
    }
  };

  const handleCustomCharacterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomCharacter();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="ageGroup">Age Group (for readers)</Label>
          <Select 
            value={storyParams.ageGroup} 
            onValueChange={(value) => handleSelectChange('ageGroup', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="children">Children (4-12)</SelectItem>
              <SelectItem value="teens">Teens (13-17)</SelectItem>
              <SelectItem value="adults">Adults (18+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select 
            value={storyParams.genre} 
            onValueChange={(value) => handleSelectChange('genre', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
              <SelectItem value="science-fiction">Science Fiction</SelectItem>
              <SelectItem value="fairy-tale">Fairy Tale</SelectItem>
              <SelectItem value="historical">Historical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="characters">Main Characters</Label>
          <Input
            id="characters"
            name="characters"
            placeholder="e.g., A brave knight, a clever wizard"
            value={storyParams.characters}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold flex items-center gap-1">
              <User className="h-4 w-4" />
              Famous Characters
            </Label>
          </div>
          <p className="text-gray-500 text-xs mb-3">Add a famous character to your story</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {famousCharacters.map((character) => (
              <Button
                key={character.name}
                variant="outline"
                size="sm"
                className="justify-start text-xs h-auto py-1 px-2"
                onClick={() => handleAddFamousCharacter(character.name)}
                title={character.description}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                {character.name}
              </Button>
            ))}
          </div>
          <div className="mt-3">
            <p className="text-gray-500 text-xs mb-2">Add your own famous character</p>
            <div className="flex gap-2">
              <Input
                value={customCharacter}
                onChange={(e) => setCustomCharacter(e.target.value)}
                placeholder="Enter a custom character"
                className="text-xs h-8"
                onKeyDown={handleCustomCharacterKeyDown}
              />
              <Button 
                size="sm" 
                className="h-8 px-3 shrink-0"
                onClick={handleAddCustomCharacter}
                disabled={!customCharacter.trim()}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="numberOfCharacters">Number of Characters</Label>
          <Select 
            value={storyParams.numberOfCharacters?.toString() || "1"} 
            onValueChange={(value) => handleSelectChange('numberOfCharacters', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number of characters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Character</SelectItem>
              <SelectItem value="2">2 Characters</SelectItem>
              <SelectItem value="3">3 Characters</SelectItem>
              <SelectItem value="4">4+ Characters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="pronouns">Character Pronouns</Label>
          <PronounSelector
            value={storyParams.pronouns}
            onChange={(value) => handleSelectChange('pronouns', value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">These pronouns will be used for the main character(s)</p>
        </div>
        
        <div>
          <Label htmlFor="setting">Setting</Label>
          <Input
            id="setting"
            name="setting"
            placeholder="e.g., Enchanted forest, Space station"
            value={storyParams.setting}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="theme">Theme or Lesson</Label>
          <Input
            id="theme"
            name="theme"
            placeholder="e.g., Friendship, Courage, Honesty"
            value={storyParams.theme}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
          <Textarea
            id="additionalDetails"
            name="additionalDetails"
            placeholder="Any specific elements you'd like included in the story..."
            value={storyParams.additionalDetails}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>
    </>
  );
};

export default StoryForm;
