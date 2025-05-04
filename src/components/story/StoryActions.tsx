
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, Dice5, Share2, Mail, Save, Globe } from 'lucide-react';
import { StoryParams } from '@/types/story';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@clerk/clerk-react';
import { saveStory } from '@/utils/clerkAuthUtils';

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
  const { isSignedIn } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const publishStoryToPublic = async () => {
    if (!storyTitle || !storyContent) {
      toast({
        title: "Cannot publish",
        description: "You need to generate a story first",
        variant: "destructive",
      });
      return;
    }
    
    if (!isSignedIn) {
      toast({
        title: "Login required",
        description: "Please login to publish stories",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsPublishing(true);
      
      // In a real implementation, this would save to a database
      // For now we'll simulate the API call with a timeout
      setTimeout(() => {
        setIsPublishing(false);
        toast({
          title: "Story published!",
          description: "Your story is now available in the community stories section",
        });
        
        // Redirect to share stories page
        window.location.href = '/share-stories';
      }, 1500);
      
    } catch (error) {
      console.error("Error publishing story:", error);
      setIsPublishing(false);
      toast({
        title: "Publishing failed",
        description: "There was an error publishing your story",
        variant: "destructive",
      });
    }
  };
  
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
      if (!isSignedIn) {
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

  const isShareable = storyTitle !== "" && storyContent !== "";

  return (
    <div className="mt-6 space-y-4">
      {/* Main action button - Generate Story */}
      <Button 
        className="w-full md:w-auto bg-gradient-to-r from-storyforge-blue to-storyforge-purple hover:opacity-90 transition-opacity text-white font-medium shadow-lg hover:shadow-xl"
        onClick={onGenerate}
        disabled={isGenerating}
        size="lg"
      >
        <Wand2 className="mr-2 h-5 w-5" />
        {isGenerating ? "Creating Your Story..." : "Generate Story"}
      </Button>
      
      {/* Secondary action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="secondary"
          onClick={onRandomize}
          disabled={isGenerating}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 shadow-sm"
        >
          <Dice5 className="mr-2 h-4 w-4 text-storyforge-purple" />
          Random
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSaveStory}
          disabled={!isShareable || !isSignedIn}
          className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        
        <Button
          variant="outline"
          onClick={publishStoryToPublic}
          disabled={!isShareable || !isSignedIn || isPublishing}
          className="bg-white hover:bg-green-50 text-green-600 border border-green-200 shadow-sm"
        >
          <Globe className="mr-2 h-4 w-4" />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
        
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
          <DropdownMenuContent align="end" className="w-48 p-2 rounded-lg border border-gray-100 shadow-lg">
            <DropdownMenuItem 
              onClick={() => handleShare('twitter')}
              className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2 text-[#1DA1F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              Twitter
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleShare('facebook')}
              className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleShare('email')}
              className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2 text-gray-600" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleShare('copy')}
              className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md px-3 py-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile optimization */}
      <style jsx>{`
        @media (max-width: 640px) {
          .dropdown-button {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StoryActions;
