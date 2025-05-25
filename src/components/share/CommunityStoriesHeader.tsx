
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface CommunityStoriesHeaderProps {
  isSignedIn: boolean;
  onCreateStory: () => void;
}

const CommunityStoriesHeader: React.FC<CommunityStoriesHeaderProps> = ({
  isSignedIn,
  onCreateStory
}) => {
  const handleCreateClick = () => {
    if (!isSignedIn) {
      toast({
        title: "Login required",
        description: "Please login to publish stories",
        variant: "destructive",
      });
      return;
    }
    onCreateStory();
  };

  const scrollToStories = () => {
    const storiesSection = document.getElementById('community-stories');
    storiesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
        Community Stories
      </h1>
      <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
        Explore stories shared by our community, or publish your own creations for others to enjoy!
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="default" onClick={handleCreateClick}>
          Create & Publish Your Story
        </Button>
        <Button variant="outline" onClick={scrollToStories}>
          Browse Community Stories
        </Button>
      </div>
    </section>
  );
};

export default CommunityStoriesHeader;
