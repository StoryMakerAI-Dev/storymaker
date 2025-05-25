
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  onPostComment: () => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  isOpen,
  onClose,
  comment,
  onCommentChange,
  onPostComment
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea 
            placeholder="Write your comment here..." 
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="resize-none" 
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onPostComment}>Post Comment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
