
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, MessageSquare, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { SharedStory } from '@/types/story';
import { toast } from "@/components/ui/use-toast";

interface StoryTableProps {
  stories: SharedStory[];
  onStoryAction: (action: string, storyId: string) => void;
}

const StoryTable: React.FC<StoryTableProps> = ({ stories, onStoryAction }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const handleTitleClick = (story: SharedStory) => {
    toast({
      title: story.title,
      description: story.content.substring(0, 100) + "...",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Story</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stories.map(story => (
          <TableRow key={story.id}>
            <TableCell className="font-medium">
              <div className="max-w-xs">
                <p 
                  className="font-semibold hover:text-storyforge-blue cursor-pointer truncate" 
                  onClick={() => handleTitleClick(story)}
                >
                  {story.title}
                </p>
              </div>
            </TableCell>
            <TableCell>{story.author}</TableCell>
            <TableCell>{formatDate(story.createdAt)}</TableCell>
            <TableCell>{story.params.genre}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  {story.likes}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {story.comments}
                </div>
                <div className="flex items-center">
                  <Share2 className="h-3 w-3 mr-1" />
                  {story.shares}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onStoryAction("Like", story.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onStoryAction("Dislike", story.id)}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onStoryAction("Comment", story.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onStoryAction("Share", story.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StoryTable;
