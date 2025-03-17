
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PencilLine, Check, X } from 'lucide-react';
import { SavedStory } from '@/types/story';
import { useToast } from "@/components/ui/use-toast";

interface StoryEditorProps {
  title: string;
  content: string;
  onSave: (updatedTitle: string, updatedContent: string) => void;
  onCancel: () => void;
}

const StoryEditor: React.FC<StoryEditorProps> = ({
  title,
  content,
  onSave,
  onCancel
}) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const { toast } = useToast();

  const handleSave = () => {
    if (!editedTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your story",
        variant: "destructive",
      });
      return;
    }
    
    if (!editedContent.trim()) {
      toast({
        title: "Content required",
        description: "Your story needs some content",
        variant: "destructive",
      });
      return;
    }
    
    onSave(editedTitle, editedContent);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="story-title" className="block text-sm font-medium mb-1">Story Title</label>
        <Input
          id="story-title"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Enter a title for your story"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="story-content" className="block text-sm font-medium mb-1">Story Content</label>
        <Textarea
          id="story-content"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={15}
          className="w-full font-serif"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default StoryEditor;
