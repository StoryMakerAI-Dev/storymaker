
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';

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
  return (
    <Button
      variant="outline"
      onClick={onPublish}
      disabled={!isShareable || !isSignedIn || isPublishing}
      className="bg-white hover:bg-green-50 text-green-600 border border-green-200 shadow-sm"
    >
      <Globe className="mr-2 h-4 w-4" />
      {isPublishing ? "Publishing..." : "Publish"}
    </Button>
  );
};

export default PublishButton;
