
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { SharedStory } from '@/types/story';

interface StoryCardProps {
  story: SharedStory;
  onStoryAction: (action: string, storyId: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onStoryAction }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-storyforge-blue to-storyforge-purple text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide opacity-80">
              {story.params?.genre || 'Story'} • {story.params?.ageGroup || 'All Ages'}
            </p>
            <CardTitle className="mt-1">{story.title}</CardTitle>
            <CardDescription className="text-white/80 mt-1">
              by {story.author || 'Anonymous'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-600 line-clamp-3">{story.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-sm text-gray-500 gap-4">
          <button 
            className="flex items-center gap-1 hover:text-storyforge-blue transition-colors"
            onClick={() => onStoryAction("Like", story.id)}
          >
            <Heart className="h-4 w-4" />
            <span>{story.likes}</span>
          </button>
          <button
            className="flex items-center gap-1 hover:text-storyforge-blue transition-colors"
            onClick={() => onStoryAction("Comment", story.id)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{story.comments}</span>
          </button>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => onStoryAction('Share', story.id)}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
