
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StoryGenerator from '@/components/StoryGenerator';
import StoryDisplay from '@/components/StoryDisplay';
import StoryEditor from '@/components/story/StoryEditor';
import HelpGuide from '@/components/HelpGuide';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@clerk/clerk-react';

const Index = () => {
  const { isSignedIn } = useAuth();
  const [storyContent, setStoryContent] = useState<string>('');
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const [currentStoryId, setCurrentStoryId] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load story from localStorage or URL on component mount
  useEffect(() => {
    // First check if there's a shared story in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedStory = urlParams.get('shared');
    
    if (sharedStory) {
      try {
        const storyData = JSON.parse(decodeURIComponent(sharedStory));
        if (storyData.title && storyData.content && storyData.shared) {
          setStoryContent(storyData.content);
          setStoryTitle(storyData.title);
          toast({
            title: "Shared story loaded!",
            description: "Someone shared this amazing story with you.",
          });
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return; // Don't load from localStorage if we have a shared story
        }
      } catch (error) {
        console.error('Error parsing shared story:', error);
      }
    }
    
    // If no shared story, load from localStorage
    const savedStoryContent = localStorage.getItem('currentStoryContent');
    const savedStoryTitle = localStorage.getItem('currentStoryTitle');
    
    if (savedStoryContent && savedStoryTitle) {
      setStoryContent(savedStoryContent);
      setStoryTitle(savedStoryTitle);
    }
  }, []);

  // Save story to localStorage whenever it changes (for non-logged-in users)
  useEffect(() => {
    if (storyContent && storyTitle) {
      localStorage.setItem('currentStoryContent', storyContent);
      localStorage.setItem('currentStoryTitle', storyTitle);
    }
  }, [storyContent, storyTitle]);

  // Clean up localStorage when user logs in and has a story
  useEffect(() => {
    if (isSignedIn && storyContent && storyTitle) {
      // Keep the story but clean up the temporary storage after a short delay
      // This ensures the story persists through the login transition
      setTimeout(() => {
        localStorage.removeItem('currentStoryContent');
        localStorage.removeItem('currentStoryTitle');
      }, 1000);
    }
  }, [isSignedIn, storyContent, storyTitle]);

  const handleStoryGenerated = (story: string, title: string, imageUrl?: string, storyId?: string) => {
    setStoryContent(story);
    setStoryTitle(title);
    setCoverImageUrl(imageUrl);
    setCurrentStoryId(storyId);
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      behavior: 'smooth' 
    });
  };

  const handleEditStory = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (updatedTitle: string, updatedContent: string) => {
    setStoryTitle(updatedTitle);
    setStoryContent(updatedContent);
    setIsEditing(false);
    toast({
      title: "Story updated!",
      description: "Your edits have been saved.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-storyforge-background via-white to-purple-50/30">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-12">
        <section className="text-center mb-16 max-w-4xl mx-auto relative">
          <div className="absolute right-0 top-0 z-10">
            <HelpGuide />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-storyforge-purple/20 to-storyforge-blue/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-storyforge-yellow/20 to-storyforge-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-storyforge-blue/10 to-storyforge-purple/10 rounded-full border border-storyforge-purple/20">
              <span className="text-sm font-semibold bg-gradient-to-r from-storyforge-blue to-storyforge-purple bg-clip-text text-transparent">
                ✨ Powered by Advanced AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 gradient-text leading-tight">
              Create Magic with
              <br />
              AI Story Generation
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into captivating stories with AI-generated text and stunning cover art
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-gray-700 text-sm font-medium shadow-lg hover-scale">
                <Sparkles className="h-4 w-4 text-storyforge-yellow" />
                <span>Custom Illustrations</span>
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-gray-700 text-sm font-medium shadow-lg hover-scale">
                <Sparkles className="h-4 w-4 text-storyforge-purple" />
                <span>Version History</span>
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-gray-700 text-sm font-medium shadow-lg hover-scale">
                <Sparkles className="h-4 w-4 text-storyforge-blue" />
                <span>Story Refinement</span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <StoryGenerator 
            onStoryGenerated={handleStoryGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            storyTitle={storyTitle}
            storyContent={storyContent}
            currentStoryId={currentStoryId}
          />
        </section>
        
        {storyContent && !isEditing && (
          <section className="mb-12 animate-fade-in">
            <StoryDisplay 
              title={storyTitle} 
              content={storyContent}
              coverImageUrl={coverImageUrl}
              onEdit={handleEditStory}
            />
          </section>
        )}
        
        {isEditing && (
          <section className="mb-12 animate-fade-in">
            <StoryEditor
              title={storyTitle}
              content={storyContent}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
