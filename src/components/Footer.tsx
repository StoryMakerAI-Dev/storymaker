
import React from 'react';
import { BookOpen, Github, Heart, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return <footer className="w-full py-6 px-4 mt-12 border-t border-gray-100">
      <div className="container max-w-6xl mx-auto">
        <div className={`flex flex-col ${isMobile ? 'gap-3' : 'md:flex-row gap-4'} justify-between items-center`}>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-storyforge-purple" />
            <span className="font-display font-medium text-gray-700">
              StoryMaker AI
            </span>
          </div>
          
          {!isMobile && <div className="text-sm text-gray-500">
              <p>Create AI-powered stories for readers of all ages</p>
            </div>}
          
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-storyforge-blue transition-colors">
              <Github className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <span className="text-gray-400">|</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-storyforge-purple hover:text-storyforge-blue hover:border-storyforge-blue"
              onClick={() => window.open("https://example.com/share-stories", "_blank")}
            >
              Share Your Stories
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-soft-purple border border-light-purple">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-storyforge-purple">Disclaimer</span>
            </div>
            <p className="text-xs md:text-sm text-gray-700 mb-2">
              Story Maker AI is designed to inspire creativity and assist in generating stories for personal enjoyment, 
              creative projects, and entertainment purposes. It is not intended to be used for academic or school assignments. 
              Using this tool for schoolwork may violate your institution's policies and could result in disciplinary action.
            </p>
            <p className="text-xs text-gray-600">
              Please use the tool responsibly and adhere to your school's guidelines.
            </p>
            <div className="flex items-center gap-1 mt-2 text-gray-500">
              <span>Made by Jacob with</span>
              <Heart className="h-3 w-3 text-storyforge-pink fill-storyforge-pink" />
            </div>
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;
