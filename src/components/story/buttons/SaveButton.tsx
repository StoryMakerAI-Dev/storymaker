
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SaveButtonProps {
  isShareable: boolean;
  isSignedIn: boolean;
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isShareable, isSignedIn, onSave }) => {
  return (
    <Button
      variant="outline"
      onClick={onSave}
      disabled={!isShareable || !isSignedIn}
      className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
    >
      <Save className="mr-2 h-4 w-4" />
      Save
    </Button>
  );
};

export default SaveButton;
