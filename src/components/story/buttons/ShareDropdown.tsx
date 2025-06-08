
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Mail, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

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
  const handleShare = async (platform: string) => {
    if (!isShareable) {
      toast({
        title: "Cannot share",
        description: "You need to generate a story first",
        variant: "destructive",
      });
      return;
    }
    
    const shareText = storyTitle 
      ? `Check out my story: "${storyTitle}"`
      : "Check out my AI-generated story!";
    
    const shareUrl = window.location.href;
    
    try {
      switch (platform) {
        case 'email':
          const emailSubject = encodeURIComponent(storyTitle || "My AI-generated story");
          const emailBody = encodeURIComponent(`${shareText}\n\n${storyContent?.substring(0, 300)}...\n\nRead the full story at: ${shareUrl}`);
          const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
          window.location.href = mailtoLink;
          
          toast({
            title: "Email client opened",
            description: "Your default email client should open with the story details",
          });
          break;
          
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
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
      
      if (platform === 'copy') {
        // Fallback for copy if clipboard API fails
        try {
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          toast({
            title: "Link copied!",
            description: "Story link has been copied to clipboard",
          });
        } catch (fallbackError) {
          toast({
            title: "Copy failed",
            description: "Unable to copy link. Please copy the URL manually.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Sharing failed",
          description: "There was an error sharing your story. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
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
          Email
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
  );
};

export default ShareDropdown;
