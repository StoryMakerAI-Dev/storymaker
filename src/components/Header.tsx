
import React from 'react';
import { BookOpen, Sparkles, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useClerk } from '@clerk/clerk-react';
import logo from '@/assets/logo.avif';

const Header = () => {
  const isMobile = useIsMobile();
  const { signOut } = useClerk();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="w-full border-b glass-card sticky top-0 z-50 shadow-lg">
      <div className="container max-w-6xl mx-auto flex justify-between items-center px-4 md:px-6 py-5">
        <Link to="/" className="flex items-center gap-3 hover-scale group">
          <div className="p-1 bg-white rounded-xl shadow-lg group-hover:shadow-xl transition-all border-2 border-storyforge-purple/20">
            <img src={logo} alt="StoryMaker AI Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-display font-extrabold`}>
            <span className="gradient-text">StoryMaker AI</span>
            {!isMobile && <span className="ml-2 text-xs bg-gradient-to-r from-storyforge-yellow/20 to-storyforge-accent/20 text-gray-700 px-2.5 py-1 rounded-full border border-storyforge-accent/30 font-semibold">Beta</span>}
          </h1>
        </Link>
        
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex items-center gap-2 mr-4 px-4 py-2 glass-card rounded-full">
              <Sparkles className="h-5 w-5 text-storyforge-yellow animate-pulse-slow" />
              <span className="font-semibold text-gray-700 text-sm">AI-Powered Stories</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 hover-scale"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!isMobile && <span className="font-medium">Logout</span>}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
