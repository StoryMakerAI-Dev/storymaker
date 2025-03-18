
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Library } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { 
  useAuth, 
  useUser, 
  UserButton, 
  SignInButton, 
  SignUpButton 
} from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedStories from './SavedStories';
import { SavedStory } from '@/types/story';

type ClerkAuthPanelProps = {
  onLoadStory?: (story: SavedStory) => void;
};

const ClerkAuthPanel: React.FC<ClerkAuthPanelProps> = ({ onLoadStory }) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [stories, setStories] = useState<SavedStory[]>([]);

  const handleLoadStory = (story: SavedStory) => {
    if (onLoadStory) {
      onLoadStory(story);
      toast({
        title: "Story loaded",
        description: "Your saved story has been loaded",
      });
    }
  };

  const getSheetTitle = () => {
    if (!isSignedIn) return "Login to StoryMaker";
    return "Your Account";
  };

  const getSheetDescription = () => {
    if (!isSignedIn) return "Sign in to save and share your stories";
    return "Manage your stories and account";
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          {isSignedIn ? (user?.username || user?.firstName || 'Account') : "Login"}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{getSheetTitle()}</SheetTitle>
          <SheetDescription>{getSheetDescription()}</SheetDescription>
        </SheetHeader>
        
        {isSignedIn ? (
          <Tabs defaultValue="account" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="stories">My Stories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4 pt-4">
              <div className="text-center">
                <div className="font-medium text-xl">{user?.username || user?.firstName}</div>
                <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              
              <div className="flex justify-center space-x-2 pt-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </TabsContent>
            
            <TabsContent value="stories" className="pt-4">
              <SavedStories onSelectStory={handleLoadStory} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            <SignInButton mode="modal">
              <Button className="w-full">Sign In</Button>
            </SignInButton>
            
            <SignUpButton mode="modal">
              <Button variant="outline" className="w-full">Create Account</Button>
            </SignUpButton>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ClerkAuthPanel;
