import React from 'react';
import { BookOpen, Github, Heart, ExternalLink, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="w-full py-8 px-4 mt-auto border-t border-border bg-muted/30">
      <div className="container max-w-7xl mx-auto">
        <div className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row gap-6'} justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground">
                StoryMaker AI
              </span>
              {!isMobile && (
                <p className="text-xs text-muted-foreground">
                  Create AI-powered stories for readers of all ages
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/chat-assistant">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                AI Chat
              </Button>
            </Link>
            <Link to="/share-stories">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Community
              </Button>
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Disclaimer</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-2 max-w-2xl">
              Story Maker AI is designed to inspire creativity and assist in generating stories for personal enjoyment, 
              creative projects, and entertainment purposes. It is not intended to be used for academic or school assignments. 
            </p>
            <p className="text-xs text-muted-foreground">
              Please use the tool responsibly and adhere to your school's guidelines.
            </p>
            <div className="flex items-center gap-1 mt-3 text-muted-foreground text-sm">
              <span>Made by Jacob with</span>
              <Heart className="h-3.5 w-3.5 text-accent fill-accent" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoryMaker AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
