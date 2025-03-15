
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [selectedOption, setSelectedOption] = useState(value);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    // Initialize custom value if value is not one of the predefined options
    if (value !== "she/her" && value !== "he/him" && value !== "custom") {
      setSelectedOption("custom");
      setCustomValue(value);
    } else {
      setSelectedOption(value);
    }
  }, [value]);

  const handleSelectChange = (newValue: string) => {
    setSelectedOption(newValue);
    if (newValue !== "custom") {
      onChange(newValue);
    } else if (customValue) {
      // If custom is selected and we already have a custom value, pass it back
      onChange(customValue);
    } else {
      // Default custom value if none exists
      onChange("they/them");
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCustomValue = e.target.value;
    setCustomValue(newCustomValue);
    if (newCustomValue) {
      onChange(newCustomValue);
    }
  };

  return (
    <div className={className}>
      <Label htmlFor="pronouns">{label}</Label>
      <Select value={selectedOption} onValueChange={handleSelectChange}>
        <SelectTrigger id="pronouns">
          <SelectValue placeholder="Select pronouns" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="she/her">She/Her</SelectItem>
          <SelectItem value="he/him">He/Him</SelectItem>
          <SelectItem value="custom">Custom/Other</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedOption === "custom" && (
        <Input
          id="custom-pronouns"
          className="mt-2"
          placeholder="Enter custom pronouns (e.g., they/them)"
          value={customValue}
          onChange={handleCustomChange}
        />
      )}
    </div>
  );
};

export default PronounSelector;
