
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
import { Button } from "@/components/ui/button";

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
    // Initialize selected option and custom value based on the provided value
    if (value === "she/her" || value === "he/him" || value === "they/them") {
      setSelectedOption(value);
    } else if (value) {
      setSelectedOption("custom");
      setCustomValue(value);
    } else {
      // Default to they/them if no value is provided
      setSelectedOption("they/them");
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
      setCustomValue("they/them");
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

  // Function to set they/them as custom value
  const setTheyThem = () => {
    setCustomValue("they/them");
    onChange("they/them");
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
          <SelectItem value="they/them">They/Them</SelectItem>
          <SelectItem value="custom">Custom/Other</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedOption === "custom" && (
        <div className="mt-2 space-y-2">
          <Input
            id="custom-pronouns"
            placeholder="Enter custom pronouns"
            value={customValue}
            onChange={handleCustomChange}
          />
        </div>
      )}
    </div>
  );
};

export default PronounSelector;
