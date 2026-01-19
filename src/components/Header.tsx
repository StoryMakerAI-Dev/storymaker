import React from 'react';
import { BookOpen, Sparkles, LogOut, MessageCircle, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useClerk, useUser } from '@clerk/clerk-react';
import logo from '@/assets/logo.avif';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const isMobile = useIsMobile();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  
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
  
  const userInitials = user?.firstName?.[0] || user?.username?.[0] || 'U';
  
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
          <div className="p-1.5 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl shadow-md group-hover:shadow-lg transition-all border border-primary/20">
            <img src={logo} alt="StoryMaker AI Logo" className="h-9 w-9 object-contain" />
          </div>
          <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-display font-bold`}>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              StoryMaker AI
            </span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-3">
          {!isMobile && (
            <div className="flex items-center gap-1.5 mr-2 px-3 py-1.5 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full border border-primary/10">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              <span className="font-medium text-muted-foreground text-xs">AI-Powered</span>
            </div>
          )}
          
          <Link to="/chat-assistant">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 hover:bg-primary/10"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              {!isMobile && <span className="font-medium text-sm">AI Chat</span>}
            </Button>
          </Link>
          
          <Link to="/share-stories">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 hover:bg-secondary/10"
            >
              <BookOpen className="h-4 w-4 text-secondary" />
              {!isMobile && <span className="font-medium text-sm">Community</span>}
            </Button>
          </Link>
          
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.firstName || user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <DropdownMenuSeparator />
                <Link to="/settings">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
