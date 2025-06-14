
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Mail, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@clerk/clerk-react';
import EmailShareDialog from './share/EmailShareDialog';
import { copyStoryLink } from './share/ShareUtils';

interface ShareDropdownProps {
  isShareable: boolean;
  storyTitle: string;
  storyContent: string;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({ 
  isShareable,
  storyTitle,
  storyContent
}) => {
  const { isSignedIn } = useAuth();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const handleShare = async (platform: string) => {
    if (!isShareable) {
      toast({
        title: "Cannot share",
        description: "You need to generate a story first",
        variant: "destructive",
      });
      return;
    }
    
    if (platform === 'email') {
      if (!isSignedIn) {
        toast({
          title: "Login required",
          description: "Please login to share stories via email",
          variant: "destructive",
        });
        return;
      }
      setIsEmailDialogOpen(true);
      return;
    }
    
    if (platform === 'copy') {
      const result = await copyStoryLink(storyTitle, storyContent);
      
      if (result.success) {
        toast({
          title: "Link copied!",
          description: "Story link has been copied with instructions to scroll down and see the story!",
        });
      } else {
        toast({
          title: "Copy failed",
          description: "Unable to copy link. Please copy the URL manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-purple-50 text-purple-600 border border-purple-200 shadow-sm"
            disabled={!isShareable}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-2 rounded-lg border border-gray-100 shadow-lg bg-white z-50">
          <DropdownMenuItem 
            onClick={() => handleShare('email')}
            className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2 text-gray-600" />
            Email Story
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleShare('copy')}
            className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 transition-colors"
          >
            <Copy className="w-4 h-4 mr-2 text-gray-600" />
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailShareDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        storyTitle={storyTitle}
        storyContent={storyContent}
      />
    </>
  );
};

export default ShareDropdown;
