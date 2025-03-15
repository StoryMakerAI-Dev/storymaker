
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PronounSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const PronounSelector: React.FC<PronounSelectorProps> = ({ 
  value, 
  onChange, 
  label = "Pronouns", 
  className = "" 
}) => {
  return (
    <div className={className}>
      <Label htmlFor="pronouns">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="pronouns">
          <SelectValue placeholder="Select pronouns" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="she/her">She/Her</SelectItem>
          <SelectItem value="he/him">He/Him</SelectItem>
          <SelectItem value="custom">Custom/Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PronounSelector;
