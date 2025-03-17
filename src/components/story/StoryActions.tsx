import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, Dice5, Share2, Mail, Save } from 'lucide-react';
import { StoryParams } from '@/types/story';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { saveStory, getLoggedInUser } from '@/utils/authUtils';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/services/firebase/authService';

interface StoryActionsProps {
  isGenerating: boolean;
  onGenerate: () => void;
  onRandomize: () => void;
  storyTitle?: string;
  storyContent?: string;
  storyParams?: StoryParams;
}

const StoryActions: React.FC<StoryActionsProps> = ({
  isGenerating,
  onGenerate,
  onRandomize,
  storyTitle = "",
  storyContent = "",
  storyParams
}) => {
  const { toast } = useToast();
  
  const handleShare = (platform: string) => {
    const shareText = storyTitle 
      ? `Check out my story: "${storyTitle}"`
      : "Check out my AI-generated story!";
    
    const shareUrl = window.location.href;
    
    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'email':
          const emailSubject = storyTitle || "My AI-generated story";
          const emailBody = `${shareText}\n\n${storyContent?.substring(0, 300)}...\n\nRead the full story at: ${shareUrl}`;
          window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, '_blank');
          break;
        case 'copy':
          navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
          toast({
            title: "Link copied!",
            description: "Story link has been copied to clipboard",
          });
          break;
        default:
          console.error('Unknown sharing platform:', platform);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "There was an error sharing your story. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveStory = async () => {
    if (!storyTitle || !storyContent) {
      toast({
        title: "Cannot save",
        description: "You need to generate a story first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const firebaseUser = getCurrentUser();
      if (!firebaseUser) {
        toast({
          title: "Login required",
          description: "Please login to save stories",
          variant: "destructive",
        });
        return;
      }
      
      const savedStory = {
        id: uuidv4(),
        title: storyTitle,
        content: storyContent,
        createdAt: new Date().toISOString(),
        params: storyParams || {
          ageGroup: 'children',
          genre: 'fantasy',
          characters: '',
          pronouns: 'she/her',
          setting: '',
          theme: '',
          additionalDetails: '',
        }
      };
      
      const success = await saveStory(savedStory);
      if (success) {
        toast({
          title: "Story saved!",
          description: "Your story has been saved to your library",
        });
      } else {
        toast({
          title: "Save failed",
          description: "There was an error saving your story",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your story",
        variant: "destructive",
      });
    }
  };

  const checkIsLoggedIn = async () => {
    const user = getCurrentUser();
    return !!user;
  };

  const isShareable = storyTitle !== "" && storyContent !== "";
  const isLoggedIn = await checkIsLoggedIn();

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
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="secondary"
          onClick={onRandomize}
          disabled={isGenerating}
          className="flex items-center justify-center"
        >
          <Dice5 className="mr-2 h-4 w-4" />
          Random
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSaveStory}
          disabled={!isShareable || !isLoggedIn}
          className="flex items-center justify-center"
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              disabled={!isShareable}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShare('twitter')}>
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('facebook')}>
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('email')}>
              <Mail className="w-4 h-4 mr-2" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('copy')}>
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StoryActions;
