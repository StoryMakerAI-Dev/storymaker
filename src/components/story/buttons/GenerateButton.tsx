
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2 } from 'lucide-react';

interface GenerateButtonProps {
  isGenerating: boolean;
  onGenerate: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ isGenerating, onGenerate }) => {
  return (
    <Button 
      className="w-full md:w-auto bg-gradient-to-r from-storyforge-blue to-storyforge-purple hover:opacity-90 transition-opacity text-white font-medium shadow-lg hover:shadow-xl"
      onClick={onGenerate}
      disabled={isGenerating}
      size="lg"
    >
      <Wand2 className="mr-2 h-5 w-5" />
      {isGenerating ? "Creating Your Story..." : "Generate Story"}
    </Button>
  );
};

export default GenerateButton;
