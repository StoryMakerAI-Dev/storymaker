
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dice5 } from 'lucide-react';

interface RandomizeButtonProps {
  isGenerating: boolean;
  onRandomize: () => void;
}

const RandomizeButton: React.FC<RandomizeButtonProps> = ({ isGenerating, onRandomize }) => {
  return (
    <Button 
      variant="secondary"
      onClick={onRandomize}
      disabled={isGenerating}
      className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 shadow-sm"
    >
      <Dice5 className="mr-2 h-4 w-4 text-storyforge-purple" />
      Random
    </Button>
  );
};

export default RandomizeButton;
