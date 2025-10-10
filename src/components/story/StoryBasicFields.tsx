
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface StoryBasicFieldsProps {
  ageGroup: string;
  genre: string;
  contentType: 'story' | 'poem';
  setting: string;
  theme: string;
  additionalDetails: string;
  wordCount?: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onWordCountChange: (value: number) => void;
}

const StoryBasicFields: React.FC<StoryBasicFieldsProps> = ({
  ageGroup,
  genre,
  contentType,
  setting,
  theme,
  additionalDetails,
  wordCount = 0,
  onInputChange,
  onSelectChange,
  onWordCountChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="contentType">Content Type</Label>
          <Select 
            value={contentType} 
            onValueChange={(value) => onSelectChange('contentType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="poem">Poem</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
      </div>
      
      <div className="mb-6">
        <Label htmlFor="genre">Genre/Style</Label>
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
            {contentType === 'poem' && (
              <>
                <SelectItem value="haiku">Haiku</SelectItem>
                <SelectItem value="limerick">Limerick</SelectItem>
                <SelectItem value="free-verse">Free Verse</SelectItem>
                <SelectItem value="sonnet">Sonnet</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
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
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="wordCount" className="flex items-center gap-2">
            Specify Word Count
            <Switch 
              id="enableWordCount" 
              checked={wordCount > 0}
              onCheckedChange={(checked) => onWordCountChange(checked ? 500 : 0)}
            />
          </Label>
          {wordCount > 0 && (
            <span className="text-sm text-gray-500">{wordCount} words</span>
          )}
        </div>
        
        {wordCount > 0 && (
          <Input
            id="wordCount"
            name="wordCount"
            type="number"
            min={100}
            max={2000}
            value={wordCount}
            onChange={(e) => onWordCountChange(Number(e.target.value))}
            className="w-full"
          />
        )}
      </div>
    </>
  );
};

export default StoryBasicFields;
