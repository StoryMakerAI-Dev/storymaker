
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CharacterInputSectionProps {
  characters: string;
  onCharacterChange: (characters: string) => void;
}

const CharacterInputSection: React.FC<CharacterInputSectionProps> = ({
  characters,
  onCharacterChange
}) => {

  return (
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
  );
};

export default CharacterInputSection;
