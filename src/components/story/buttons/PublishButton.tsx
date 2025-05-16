
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { validatePublishedStory } from '@/utils/story/validationUtils';

interface PublishButtonProps {
  isShareable: boolean;
  isSignedIn: boolean;
  isPublishing: boolean;
  onPublish: () => void;
}

const PublishButton: React.FC<PublishButtonProps> = ({ 
  isShareable, 
  isSignedIn, 
  isPublishing, 
  onPublish 
}) => {
  const handlePublish = () => {
    if (!isShareable) {
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

    onPublish();
  };

  return (
    <Button
      variant="outline"
      onClick={handlePublish}
      disabled={isPublishing}
      className="bg-white hover:bg-green-50 text-green-600 border border-green-200 shadow-sm"
    >
      <Globe className="mr-2 h-4 w-4" />
      {isPublishing ? "Publishing..." : "Publish"}
    </Button>
  );
};

export default PublishButton;
