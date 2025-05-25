
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PublishStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onPublish: () => void;
}

const PublishStoryDialog: React.FC<PublishStoryDialogProps> = ({
  isOpen,
  onClose,
  title,
  content,
  onTitleChange,
  onContentChange,
  onPublish
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish a Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Story Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter a catchy title for your story" 
            />
          </div>
          <div>
            <Label htmlFor="content">Story Content</Label>
            <Textarea 
              id="content" 
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Write your story here..." 
              rows={10}
              className="resize-none" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onPublish}>Publish Story</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishStoryDialog;
