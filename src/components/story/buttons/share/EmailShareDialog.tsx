
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useUser } from '@clerk/clerk-react';

interface EmailShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
  storyContent: string;
}

const EmailShareDialog: React.FC<EmailShareDialogProps> = ({
  isOpen,
  onClose,
  storyTitle,
  storyContent
}) => {
  const { user } = useUser();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');

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
      
      const emailSubject = encodeURIComponent(`${senderName} shared a story: "${storyTitle}"`);
      const emailBody = encodeURIComponent(
        `Hi there!\n\n${senderName} wanted to share this AI-generated story with you:\n\n` +
        `"${storyTitle}"\n\n${storyContent}\n\n` +
        `This story was created using our AI Story Generator. ` +
        `${customMessage ? `\n\nPersonal message: ${customMessage}` : ''}\n\n` +
        `Create your own stories at: ${window.location.origin}`
      );
      
      // Try different email clients
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${emailSubject}&body=${emailBody}`;
      const yahooUrl = `https://compose.mail.yahoo.com/?to=${recipientEmail}&subject=${emailSubject}&body=${emailBody}`;
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${recipientEmail}&subject=${emailSubject}&body=${emailBody}`;
      const mailtoLink = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
      
      // Try opening Gmail first, then fallback to default mail client
      const newWindow = window.open(gmailUrl, '_blank');
      
      // If Gmail doesn't open (popup blocked), try default mailto
      setTimeout(() => {
        if (!newWindow || newWindow.closed) {
          window.location.href = mailtoLink;
        }
      }, 1000);
      
      toast({
        title: "Email opened",
        description: `Opening email client to send the story to ${recipientEmail}`,
      });
      
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{storyTitle}" via Email</DialogTitle>
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
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleEmailShare}>
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailShareDialog;
