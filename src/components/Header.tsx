
import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import UserMenu from './UserMenu';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-storyforge-purple" />
          <h1 className="text-2xl font-display font-bold">
            <span className="text-storyforge-blue">Story</span>
            <span className="text-storyforge-purple">Maker</span>
            <span className="text-gray-700"> AI</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-storyforge-yellow animate-pulse-slow" />
            <span className="font-medium text-gray-600">AI-Powered Stories</span>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
