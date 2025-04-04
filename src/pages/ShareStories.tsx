import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Music, Image, Mic } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ShareStories = () => {
  const handleExternalLink = (service: string) => {
    switch(service) {
      case 'TextMakerAI':
        window.open("https://textmaker.storyforge.ai", "_blank");
        break;
      case 'PictureMakerAI':
        window.open("https://picturemaker.storyforge.ai", "_blank");
        break;
      default:
        toast({
          title: "Coming Soon",
          description: "This feature is currently in development.",
          variant: "default"
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-storyforge-background to-white">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
            Share Your Stories
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Connect with the StoryMaker community! Share your creations and explore what others have made.
          </p>
        </section>
        
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-soft-purple rounded-full">
                <Music className="h-8 w-8 text-storyforge-purple" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Add Sound</h2>
            <p className="text-gray-600 text-center mb-4">
              Transform your stories with immersive audio experiences. Add music, sound effects, and voice narration to bring your narratives to life with our AI-powered text-to-sound technology.
            </p>
            <Button 
              className="w-full"
              onClick={() => handleExternalLink('TextMakerAI')}
            >
              Try TextMaker AI
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-soft-purple rounded-full">
                <Image className="h-8 w-8 text-storyforge-purple" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Add Images</h2>
            <p className="text-gray-600 text-center mb-4">Illustrate your stories with AI-generated images</p>
            <Button 
              className="w-full"
              onClick={() => handleExternalLink('PictureMakerAI')}
            >
              Try PictureMaker AI
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-soft-purple rounded-full">
                <Mic className="h-8 w-8 text-storyforge-purple" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Text to Speech</h2>
            <p className="text-gray-600 text-center mb-4">Convert your stories to spoken audio narration</p>
            <Button 
              className="w-full"
              onClick={() => handleExternalLink('TextMakerAI')}
            >
              Try TextMaker AI
            </Button>
          </div>
        </section>
        
        <section className="bg-white p-8 rounded-lg shadow-md border border-gray-100 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Community Stories</h2>
          <p className="text-gray-600 text-center mb-6">
            This feature is coming soon! You'll be able to browse and interact with stories from other creators.
          </p>
          <div className="flex justify-center">
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Coming soon!",
                  description: "Community stories will be available soon."
                });
              }}
            >
              Explore Stories
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShareStories;
