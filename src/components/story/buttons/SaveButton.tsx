
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface SaveButtonProps {
  isShareable: boolean;
  isSignedIn: boolean;
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isShareable, isSignedIn, onSave }) => {
  const handleSave = () => {
    if (!isShareable) {
      toast({
        title: "Cannot save",
        description: "You need to generate a story first",
        variant: "destructive",
      });
      return;
    }

    if (!isSignedIn) {
      toast({
        title: "Login required",
        description: "Please login to save stories",
        variant: "destructive",
      });
      return;
    }

    onSave();
  };

  return (
    <Button
      variant="outline"
      onClick={handleSave}
      className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
    >
      <Save className="mr-2 h-4 w-4" />
      Save
    </Button>
  );
};

export default SaveButton;
