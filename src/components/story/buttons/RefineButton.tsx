import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RefineButtonProps {
  onRefine: (instruction: string) => void;
  disabled?: boolean;
}

const RefineButton: React.FC<RefineButtonProps> = ({ onRefine, disabled }) => {
  const refinementOptions = [
    { label: 'Make it funnier', instruction: 'Rewrite the story to be more humorous and add funny moments' },
    { label: 'Add more dialogue', instruction: 'Rewrite the story with more conversations between characters' },
    { label: 'Different ending', instruction: 'Keep the story the same but create a completely different ending' },
    { label: 'More descriptive', instruction: 'Rewrite the story with more vivid descriptions and sensory details' },
    { label: 'Add a twist', instruction: 'Add an unexpected plot twist to the story' },
    { label: 'Shorter version', instruction: 'Condense the story to about half its length while keeping the key elements' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Refine Story
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {refinementOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={() => onRefine(option.instruction)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RefineButton;
