
import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import { User, SavedStory } from '@/types/story';
import SavedStories from './SavedStories';

type ClerkAuthPanelProps = {
  onLoadStory?: (story: SavedStory) => void;
};

const ClerkAuthPanel: React.FC<ClerkAuthPanelProps> = ({ onLoadStory }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  const handleLoadStory = (story: SavedStory) => {
    if (onLoadStory) {
      onLoadStory(story);
      toast({
        title: "Story loaded",
        description: "Your saved story has been loaded",
      });
    }
  };

  const getDisplayName = () => {
    if (!user) return "";
    return user.username || user.firstName || "User";
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          {isSignedIn ? getDisplayName() : "Login"}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isSignedIn ? "Your Account" : "Login to StoryMaker"}</SheetTitle>
          <SheetDescription>
            {isSignedIn 
              ? "Manage your stories and account" 
              : "Sign in to save and share your stories"}
          </SheetDescription>
        </SheetHeader>
        
        {isSignedIn ? (
          <Tabs defaultValue="account" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="stories">My Stories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4 pt-4">
              <div className="text-center">
                <div className="font-medium text-xl">{getDisplayName()}</div>
                <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              
              <div className="flex justify-center mt-4">
                <UserButton afterSignOutUrl="/" />
              </div>
              
              <div className="flex justify-center space-x-2 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleSignOut}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="stories" className="pt-4">
              <SavedStories onSelectStory={handleLoadStory} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col gap-4 py-6">
            <div className="text-center space-y-4">
              <SignInButton mode="modal">
                <Button className="w-full">Sign In</Button>
              </SignInButton>
              
              <div className="text-sm text-gray-500">Don't have an account?</div>
              
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full">Sign Up</Button>
              </SignUpButton>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ClerkAuthPanel;
