
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PronounSelector from '../PronounSelector';
import { StoryParams } from '@/types/story';

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
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="ageGroup">Age Group</Label>
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
        
        <PronounSelector
          value={storyParams.pronouns}
          onChange={(value) => handleSelectChange('pronouns', value)}
          className="mt-4"
        />
        
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
