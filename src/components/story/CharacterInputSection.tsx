
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Plus } from 'lucide-react';

interface CharacterInputSectionProps {
  characters: string;
  onCharacterChange: (characters: string) => void;
}

const famousCharacters = [
  { name: "Albert Einstein", description: "Brilliant physicist and Nobel Prize winner" },
  { name: "Marie Curie", description: "Pioneering scientist and two-time Nobel Prize winner" },
  { name: "Leonardo da Vinci", description: "Renaissance polymath, artist, and inventor" },
  { name: "William Shakespeare", description: "Legendary playwright and poet" },
  { name: "Cleopatra", description: "Last active ruler of the Ptolemaic Kingdom of Egypt" },
  { name: "Amelia Earhart", description: "Aviation pioneer and author" }
];

const CharacterInputSection: React.FC<CharacterInputSectionProps> = ({
  characters,
  onCharacterChange
}) => {
  const [customCharacter, setCustomCharacter] = useState('');

  const handleAddFamousCharacter = (character: string) => {
    const currentCharacters = characters;
    const newCharacters = currentCharacters 
      ? `${currentCharacters}, ${character}` 
      : character;
    
    onCharacterChange(newCharacters);
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
      <div>
        <Label htmlFor="characters">Main Characters</Label>
        <Input
          id="characters"
          name="characters"
          placeholder="e.g., A brave knight, a clever wizard"
          value={characters}
          onChange={(e) => onCharacterChange(e.target.value)}
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
    </>
  );
};

export default CharacterInputSection;
