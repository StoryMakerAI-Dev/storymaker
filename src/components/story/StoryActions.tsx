
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, Dice5 } from 'lucide-react';
import { StoryParams, initialStoryParams } from '@/types/story';

interface StoryActionsProps {
  isGenerating: boolean;
  onGenerate: () => void;
  onRandomize: () => void;
}

const StoryActions: React.FC<StoryActionsProps> = ({
  isGenerating,
  onGenerate,
  onRandomize
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button 
        className="bg-gradient-to-r from-storyforge-blue to-storyforge-purple hover:opacity-90 transition-opacity"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        <Wand2 className="mr-2 h-4 w-4" />
        {isGenerating ? "Creating Your Story..." : "Generate Story"}
      </Button>
      
      <Button 
        variant="secondary"
        onClick={onRandomize}
        disabled={isGenerating}
        className="flex items-center justify-center"
      >
        <Dice5 className="mr-2 h-4 w-4" />
        Random Story Ideas
      </Button>
    </div>
  );
};

export default StoryActions;
