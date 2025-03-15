
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StoryGenerator from '@/components/StoryGenerator';
import StoryDisplay from '@/components/StoryDisplay';
import Footer from '@/components/Footer';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [storyContent, setStoryContent] = useState<string>('');
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set a flag to track component mounting
    let isMounted = true;
    
    // Mark page as loaded after a short delay to ensure components are ready
    const timer = setTimeout(() => {
      if (isMounted) {
        try {
          console.log('Checking if components are loaded...');
          setPageLoaded(true);
        } catch (error) {
          console.error('Page loading error:', error);
          if (isMounted) {
            setLoadError('Failed to load page components. Please refresh the page.');
            toast({
              title: "Loading Error",
              description: "There was a problem loading the application. Please try refreshing.",
              variant: "destructive"
            });
          }
        }
      }
    }, 800);
    
    // Add a fallback timer to set page as loaded even if there was an error
    const fallbackTimer = setTimeout(() => {
      if (isMounted && !pageLoaded) {
        console.log('Forcing page load after timeout');
        setPageLoaded(true);
      }
    }, 3000);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleStoryGenerated = (story: string, title: string) => {
    setStoryContent(story);
    setStoryTitle(title);
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      behavior: 'smooth' 
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!pageLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-storyforge-background to-white p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-storyforge-purple animate-spin" />
          <p className="text-lg text-gray-600 text-center">Loading StoryMaker AI...</p>
          {loadError && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg max-w-md text-center">
              {loadError}
              <Button 
                onClick={handleRefresh} 
                className="mt-2 px-4 py-1 bg-red-100 hover:bg-red-200 rounded-full text-sm transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-storyforge-background to-white">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
            AI-Powered Story Creator
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Generate unique stories for any age group with our intelligent storytelling engine
          </p>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full text-gray-600 text-sm border border-gray-100 shadow-sm">
              <Sparkles className="h-4 w-4 text-storyforge-yellow" />
              <span>Endless possibilities await your imagination</span>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <StoryGenerator 
            onStoryGenerated={handleStoryGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </section>
        
        {storyContent && (
          <section className="mb-12 animate-fade-in">
            <StoryDisplay 
              title={storyTitle} 
              content={storyContent} 
            />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
