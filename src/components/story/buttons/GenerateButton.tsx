
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
      className="w-full md:w-auto bg-gradient-to-r from-storyforge-blue via-storyforge-purple to-storyforge-accent hover:shadow-2xl transition-all duration-300 text-white font-bold shadow-xl hover:scale-105 relative overflow-hidden group"
      onClick={onGenerate}
      disabled={isGenerating}
      size="lg"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <Wand2 className="mr-2 h-5 w-5 relative z-10" />
      <span className="relative z-10">{isGenerating ? "Creating Your Story..." : "Generate Story"}</span>
    </Button>
  );
};

export default GenerateButton;
