
import React from 'react';
import { Button } from "@/components/ui/button";
import { Music, Image, Mic, BookText } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const EnhanceStoriesSection: React.FC = () => {
  const handleExternalLink = (service: string) => {
    switch(service) {
      case 'TextMakerAI':
        window.open("https://preview--textmaker.lovable.app/", "_blank");
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
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-soft-purple rounded-full">
              <Music className="h-8 w-8 text-storyforge-purple" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center mb-2">Add Sound</h2>
          <p className="text-gray-600 text-center mb-4">Enhance your stories with music and sound effects</p>
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
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-soft-yellow rounded-full">
            <BookText className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">Word Count Feature</h2>
        <p className="text-gray-600 text-center mb-4">
          Need a specific word count for your story? Our generator now supports creating stories with custom word counts.
        </p>
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Try the Word Count Feature
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhanceStoriesSection;
