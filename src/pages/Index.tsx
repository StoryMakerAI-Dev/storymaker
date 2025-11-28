import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StoryGenerator from '@/components/StoryGenerator';
import StoryDisplay from '@/components/StoryDisplay';
import StoryEditor from '@/components/story/StoryEditor';
import HelpGuide from '@/components/HelpGuide';
import Footer from '@/components/Footer';
import UsageStats from '@/components/dashboard/UsageStats';
import WritingGoals from '@/components/dashboard/WritingGoals';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentStories from '@/components/dashboard/RecentStories';
import TemplateSelector from '@/components/templates/TemplateSelector';
import CharacterLibrary from '@/components/characters/CharacterLibrary';
import CollectionManager from '@/components/collections/CollectionManager';
import { Sparkles, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoryTemplate } from '@/services/supabase/templatesService';

const Index = () => {
  const { isSignedIn } = useAuth();
  const [storyContent, setStoryContent] = useState<string>('');
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const [currentStoryId, setCurrentStoryId] = useState<string>();
  const [currentFont, setCurrentFont] = useState<string>('crimson');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  // Load story from localStorage or URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedStory = urlParams.get('shared');
    
    if (sharedStory) {
      try {
        const storyData = JSON.parse(decodeURIComponent(sharedStory));
        if (storyData.title && storyData.content && storyData.shared) {
          setStoryContent(storyData.content);
          setStoryTitle(storyData.title);
          setShowDashboard(false);
          toast({
            title: "Shared story loaded!",
            description: "Someone shared this amazing story with you.",
          });
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }
      } catch (error) {
        console.error('Error parsing shared story:', error);
      }
    }
    
    const savedStoryContent = localStorage.getItem('currentStoryContent');
    const savedStoryTitle = localStorage.getItem('currentStoryTitle');
    
    if (savedStoryContent && savedStoryTitle) {
      setStoryContent(savedStoryContent);
      setStoryTitle(savedStoryTitle);
      setShowDashboard(false);
    }
  }, []);

  useEffect(() => {
    if (storyContent && storyTitle) {
      localStorage.setItem('currentStoryContent', storyContent);
      localStorage.setItem('currentStoryTitle', storyTitle);
    }
  }, [storyContent, storyTitle]);

  useEffect(() => {
    if (isSignedIn && storyContent && storyTitle) {
      setTimeout(() => {
        localStorage.removeItem('currentStoryContent');
        localStorage.removeItem('currentStoryTitle');
      }, 1000);
    }
  }, [isSignedIn, storyContent, storyTitle]);

  const handleStoryGenerated = (story: string, title: string, imageUrl?: string, storyId?: string, font?: string) => {
    setStoryContent(story);
    setStoryTitle(title);
    setCoverImageUrl(imageUrl);
    setCurrentStoryId(storyId);
    setCurrentFont(font || 'crimson');
    setShowDashboard(false);
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

  const handleTemplateSelect = (template: StoryTemplate) => {
    toast({
      title: "Template selected!",
      description: `Using template: ${template.name}`,
    });
    setShowDashboard(false);
    // Scroll to story generator
    setTimeout(() => {
      const generator = document.getElementById('story-generator');
      generator?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-surface via-background to-primary/5">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 max-w-5xl mx-auto relative">
          <div className="absolute right-0 top-0 z-10">
            <HelpGuide />
          </div>
          
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          
          <div className="relative animate-fade-in">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ✨ Powered by Advanced AI
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Create Magic with
              <br />
              AI Story Generation
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into captivating stories with AI-generated text and stunning cover art
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:scale-105">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Custom Illustrations</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:scale-105">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Version History</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:scale-105">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span>Story Refinement</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        {showDashboard && isSignedIn && (
          <section className="mb-12 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-display font-bold">Your Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 space-y-6">
                <QuickActions />
                <UsageStats />
              </div>
              <div className="space-y-6">
                <WritingGoals />
                <RecentStories />
              </div>
            </div>

            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="templates">Story Templates</TabsTrigger>
                <TabsTrigger value="characters">Character Library</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
              </TabsList>
              <TabsContent value="templates" className="animate-fade-in">
                <TemplateSelector onSelectTemplate={handleTemplateSelect} />
              </TabsContent>
              <TabsContent value="characters" className="animate-fade-in">
                <CharacterLibrary />
              </TabsContent>
              <TabsContent value="collections" className="animate-fade-in">
                <CollectionManager />
              </TabsContent>
            </Tabs>
          </section>
        )}
        
        {/* Story Generator */}
        <section id="story-generator" className="mb-16 scroll-mt-20">
          <StoryGenerator 
            onStoryGenerated={handleStoryGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            storyTitle={storyTitle}
            storyContent={storyContent}
            currentStoryId={currentStoryId}
          />
        </section>
        
        {/* Story Display */}
        {storyContent && !isEditing && (
          <section id="saved-stories" className="mb-12 animate-fade-in scroll-mt-20">
            <StoryDisplay 
              title={storyTitle} 
              content={storyContent}
              coverImageUrl={coverImageUrl}
              fontClass={currentFont === 'crimson' ? 'font-story' : currentFont === 'inter' ? 'font-sans' : 'font-display'}
              onEdit={handleEditStory}
            />
          </section>
        )}
        
        {/* Story Editor */}
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