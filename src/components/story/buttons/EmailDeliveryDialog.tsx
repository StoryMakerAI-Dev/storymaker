import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface EmailDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  senderName: string;
}

const EMAIL_TEMPLATES = [
  { id: 'simple', name: 'Simple', description: 'Clean and straightforward' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated with gradient header' },
  { id: 'minimal', name: 'Minimal', description: 'Ultra-clean, no distractions' },
];

const EmailDeliveryDialog: React.FC<EmailDeliveryDialogProps> = ({
  open,
  onOpenChange,
  title,
  content,
  senderName,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [templateType, setTemplateType] = useState('simple');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = async () => {
    if (!recipientEmail.trim()) {
      toast.error('Please enter recipient email');
      return;
    }

    if (!validateEmail(recipientEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-story-email', {
        body: {
          recipientEmail,
          recipientName,
          senderName,
          storyTitle: title,
          storyContent: content,
          templateType,
          customMessage,
        },
      });

      if (error) throw error;

      toast.success('Story sent successfully!');
      onOpenChange(false);
      setRecipientEmail('');
      setRecipientName('');
      setCustomMessage('');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Story via Email
          </DialogTitle>
          <DialogDescription>
            Share "{title}" with someone special
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email *</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="friend@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name (optional)</Label>
            <Input
              id="recipientName"
              placeholder="Their name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select value={templateType} onValueChange={setTemplateType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <span className="font-medium">{template.name}</span>
                      <span className="text-muted-foreground ml-2">— {template.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customMessage">Personal Message (optional)</Label>
            <Textarea
              id="customMessage"
              placeholder="Add a personal note..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending || !recipientEmail.trim()}>
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Story
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDeliveryDialog;
