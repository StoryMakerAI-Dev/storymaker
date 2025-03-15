
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type PronounOption = 'he/him' | 'she/her' | 'they/them' | 'ze/zir' | 'xe/xem' | 'other';

interface PronounSelectorProps {
  value: PronounOption;
  onChange: (value: PronounOption) => void;
  disabled?: boolean;
}

const PronounSelector: React.FC<PronounSelectorProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="pronouns">Pronouns (for character)</Label>
      <Select 
        value={value} 
        onValueChange={(val) => onChange(val as PronounOption)}
        disabled={disabled}
      >
        <SelectTrigger id="pronouns" className="w-full">
          <SelectValue placeholder="Select pronouns" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="he/him">He/Him</SelectItem>
          <SelectItem value="she/her">She/Her</SelectItem>
          <SelectItem value="they/them">They/Them</SelectItem>
          <SelectItem value="ze/zir">Ze/Zir</SelectItem>
          <SelectItem value="xe/xem">Xe/Xem</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PronounSelector;
