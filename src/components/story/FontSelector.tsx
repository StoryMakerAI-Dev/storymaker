import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, onFontChange }) => {
  const fonts = [
    { value: 'crimson', label: 'Crimson Pro (Elegant)', class: 'font-story' },
    { value: 'inter', label: 'Inter (Modern)', class: 'font-sans' },
    { value: 'display', label: 'Display (Bold)', class: 'font-display' },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="font-select">Story Font</Label>
      <Select value={selectedFont} onValueChange={onFontChange}>
        <SelectTrigger id="font-select">
          <SelectValue placeholder="Choose a font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span className={font.class}>{font.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontSelector;
