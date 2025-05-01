
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StoryBasicFieldsProps {
  ageGroup: string;
  genre: string;
  setting: string;
  theme: string;
  additionalDetails: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const StoryBasicFields: React.FC<StoryBasicFieldsProps> = ({
  ageGroup,
  genre,
  setting,
  theme,
  additionalDetails,
  onInputChange,
  onSelectChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="ageGroup">Age Group (for readers)</Label>
          <Select 
            value={ageGroup} 
            onValueChange={(value) => onSelectChange('ageGroup', value)}
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
            value={genre} 
            onValueChange={(value) => onSelectChange('genre', value)}
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
      
      <div>
        <Label htmlFor="setting">Setting</Label>
        <Input
          id="setting"
          name="setting"
          placeholder="e.g., Enchanted forest, Space station"
          value={setting}
          onChange={onInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="theme">Theme or Lesson</Label>
        <Input
          id="theme"
          name="theme"
          placeholder="e.g., Friendship, Courage, Honesty"
          value={theme}
          onChange={onInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
        <Textarea
          id="additionalDetails"
          name="additionalDetails"
          placeholder="Any specific elements you'd like included in the story..."
          value={additionalDetails}
          onChange={onInputChange}
          rows={3}
        />
      </div>
    </>
  );
};

export default StoryBasicFields;
