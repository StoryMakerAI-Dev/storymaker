import React from 'react';
import { BookOpen, Github, Heart } from 'lucide-react';
const Footer = () => {
  return <footer className="w-full py-6 px-4 mt-12 border-t border-gray-100">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-storyforge-purple" />
            <span className="font-display font-medium text-gray-700">
              StoryMaker AI
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Create AI-powered stories for readers of all ages</p>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="#" className="text-gray-500 hover:text-storyforge-blue transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>Made by Jacob and with</span>
              <Heart className="h-3 w-3 text-storyforge-pink fill-storyforge-pink" />
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;