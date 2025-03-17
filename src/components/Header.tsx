
import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-storyforge-purple" />
          <h1 className="text-2xl font-display font-bold">
            <span className="text-storyforge-blue">Story</span>
            <span className="text-storyforge-purple">Maker</span>
            <span className="text-gray-700"> AI</span>
            <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Demo</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-storyforge-yellow animate-pulse-slow" />
          <span className="font-medium text-gray-600">AI-Powered Stories</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
