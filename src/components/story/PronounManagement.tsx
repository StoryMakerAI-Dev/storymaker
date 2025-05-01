
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PronounSelector from '../PronounSelector';

interface PronounManagementProps {
  numberOfCharacters: number;
  pronouns: string;
  onPronounsChange: (pronouns: string) => void;
  onNumberOfCharactersChange: (value: string) => void;
}

const PronounManagement: React.FC<PronounManagementProps> = ({
  numberOfCharacters,
  pronouns,
  onPronounsChange,
  onNumberOfCharactersChange
}) => {
  const [characterPronouns, setCharacterPronouns] = useState<string[]>(['they/them']);

  // Handle individual character pronoun changes
  const handleCharacterPronounChange = (index: number, value: string) => {
    const newPronouns = [...characterPronouns];
    newPronouns[index] = value;
    setCharacterPronouns(newPronouns);
    
    // Update the main pronouns string
    onPronounsChange(newPronouns.join(','));
  };

  // Handle changing the number of characters and update the pronouns array accordingly
  const handleNumberOfCharactersChange = (value: string) => {
    onNumberOfCharactersChange(value);
    const numChars = parseInt(value);
    
    // Update the character pronouns array to match the number of characters
    const newPronouns = [...characterPronouns];
    while (newPronouns.length < numChars) {
      newPronouns.push('they/them'); // Default for new characters
    }
    
    setCharacterPronouns(newPronouns.slice(0, numChars));
    
    // Update the main pronouns string by joining all character pronouns
    const pronounsString = newPronouns.slice(0, numChars).join(',');
    onPronounsChange(pronounsString);
  };

  // Initialize pronouns from props
  useEffect(() => {
    if (pronouns && pronouns.includes(',')) {
      const pronounsArray = pronouns.split(',');
      setCharacterPronouns(pronounsArray);
    } else if (pronouns) {
      setCharacterPronouns([pronouns]);
    }
  }, [pronouns]);

  return (
    <>
      <div>
        <Label htmlFor="numberOfCharacters">Number of Characters</Label>
        <Select 
          value={numberOfCharacters?.toString() || "1"} 
          onValueChange={handleNumberOfCharactersChange}
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
        <Label className="mb-2 block">Character Pronouns</Label>
        {parseInt(numberOfCharacters?.toString() || "1") > 1 ? (
          <div className="space-y-4">
            {Array.from({length: parseInt(numberOfCharacters?.toString() || "1")}).map((_, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <Label className="text-sm mb-2 block">Character {index + 1}</Label>
                <PronounSelector
                  value={characterPronouns[index] || 'they/them'}
                  onChange={(value) => handleCharacterPronounChange(index, value)}
                  className="mt-1"
                />
              </div>
            ))}
            <p className="text-xs text-gray-500">These pronouns will be used for each character in order</p>
          </div>
        ) : (
          <>
            <PronounSelector
              value={pronouns}
              onChange={onPronounsChange}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">These pronouns will be used for the main character</p>
          </>
        )}
      </div>
    </>
  );
};

export default PronounManagement;
