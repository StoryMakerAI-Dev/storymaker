import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StoryGenerator from '@/components/StoryGenerator';
import StoryDisplay from '@/components/StoryDisplay';
import StoryEditor from '@/components/story/StoryEditor';
import HelpGuide from '@/components/HelpGuide';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/clerk-react';

const Index = () => {
  const { isSignedIn } = useAuth();
  const [storyContent, setStoryContent] = useState<string>('');
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load story from localStorage on component mount
  useEffect(() => {
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

  const handleStoryGenerated = (story: string, title: string) => {
    setStoryContent(story);
    setStoryTitle(title);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-storyforge-background to-white">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-12 max-w-3xl mx-auto relative">
          <div className="absolute right-0 top-0">
            <HelpGuide />
          </div>
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
            storyTitle={storyTitle}
            storyContent={storyContent}
          />
        </section>
        
        {storyContent && !isEditing && (
          <section className="mb-12 animate-fade-in">
            <StoryDisplay 
              title={storyTitle} 
              content={storyContent}
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
