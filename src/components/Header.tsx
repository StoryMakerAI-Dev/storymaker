
import React from 'react';
import { BookOpen, Sparkles, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useClerk } from '@clerk/clerk-react';

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
    <header className="w-full py-4 px-4 md:px-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-storyforge-purple" />
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-display font-bold`}>
            <span className="text-storyforge-blue">Story</span>
            <span className="text-storyforge-purple">Maker</span>
            {!isMobile && <span className="text-gray-700"> AI</span>}
            {!isMobile && <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Demo</span>}
          </h1>
        </Link>
        
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex items-center gap-2 mr-4">
              <Sparkles className="h-5 w-5 text-storyforge-yellow animate-pulse-slow" />
              <span className="font-medium text-gray-600">AI-Powered Stories</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!isMobile && "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
