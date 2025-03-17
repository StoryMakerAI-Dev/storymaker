
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Lightbulb, ListOrdered, BookOpen, User, Wand2, Share2, Save } from 'lucide-react';

const HelpGuide: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-10 w-10 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
          title="How to use StoryMaker AI"
        >
          <Lightbulb className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            How to Use StoryMaker AI
          </SheetTitle>
          <SheetDescription>
            Follow these steps to create your magical story
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-storyforge-blue/20 text-storyforge-blue">
              <ListOrdered className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Step 1: Set Parameters</h3>
              <p className="text-sm text-gray-500">
                Choose the age group, genre, characters, and other details for your story.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-storyforge-blue/20 text-storyforge-blue">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Step 2: Create an Account (Optional)</h3>
              <p className="text-sm text-gray-500">
                Sign up to save your stories and access them later.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-storyforge-blue/20 text-storyforge-blue">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Step 3: Generate Your Story</h3>
              <p className="text-sm text-gray-500">
                Click the "Generate Story" button and watch as AI creates a unique tale based on your inputs.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-storyforge-blue/20 text-storyforge-blue">
              <Save className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Step 4: Save or Edit Your Story</h3>
              <p className="text-sm text-gray-500">
                Like your story? Save it to your library or edit it to make it perfect.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-storyforge-blue/20 text-storyforge-blue">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Step 5: Share Your Creation</h3>
              <p className="text-sm text-gray-500">
                Share your story with friends and family via social media or email.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-storyforge-blue/20 text-storyforge-blue">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Tips for Great Stories</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Be specific about characters and setting</p>
                <p>• Add interesting details to make your story unique</p>
                <p>• Try different genres and age groups for variety</p>
                <p>• Use the "Random" button for inspiration</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HelpGuide;
