
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Mail, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@clerk/clerk-react';

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
  const { user, isSignedIn } = useAuth();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');

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
      try {
        const shareUrl = window.location.href;
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Story link has been copied to clipboard",
        });
      } catch (error) {
        console.error('Error copying link:', error);
        // Fallback for copy if clipboard API fails
        try {
          const shareUrl = window.location.href;
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
      }
    }
  };

  const handleEmailShare = () => {
    if (!recipientEmail) {
      toast({
        title: "Email required",
        description: "Please enter a recipient email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const senderName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.emailAddresses[0]?.emailAddress || 'A friend';
      const shareUrl = window.location.href;
      
      const defaultMessage = `Hi there!\n\n${senderName} wanted to share this amazing AI-generated story with you: "${storyTitle}"\n\n${storyContent.substring(0, 300)}...\n\nRead the full story at: ${shareUrl}\n\nEnjoy reading!`;
      
      const emailSubject = encodeURIComponent(`${senderName} shared a story: "${storyTitle}"`);
      const emailBody = encodeURIComponent(customMessage || defaultMessage);
      const mailtoLink = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
      
      window.location.href = mailtoLink;
      
      toast({
        title: "Email client opened",
        description: `Email prepared for ${recipientEmail}`,
      });
      
      setIsEmailDialogOpen(false);
      setRecipientEmail('');
      setCustomMessage('');
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast({
        title: "Email sharing failed",
        description: "There was an error preparing the email. Please try again.",
        variant: "destructive",
      });
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

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Story via Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="friend@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEmailShare}>
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareDropdown;
