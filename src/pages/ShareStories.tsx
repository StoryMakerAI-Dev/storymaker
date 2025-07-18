import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@clerk/clerk-react';
import { SharedStory } from '@/types/story';

// Import refactored components
import CommunityStoriesHeader from '@/components/share/CommunityStoriesHeader';
import StoryFilters from '@/components/share/StoryFilters';
import StoryTable from '@/components/share/StoryTable';
import StoryCard from '@/components/share/StoryCard';
import PublishStoryDialog from '@/components/share/PublishStoryDialog';
import CommentDialog from '@/components/share/CommentDialog';
import EnhanceStoriesSection from '@/components/share/EnhanceStoriesSection';

// Import utility functions
import { handleStoryAction } from '@/components/share/StoryManagement';
import { handlePostStory } from '@/components/share/StoryPublisher';
import { handlePostComment, StoryComment } from '@/components/share/CommentManager';

// Sample data - in a real app this would come from an API or database
const exampleSharedStories: SharedStory[] = [
  {
    id: "story-1",
    title: "The Whispering Woods",
    content: "Deep in the forest where trees speak in riddles and shadows dance, young Elara discovered a hidden path. The ancient oaks parted to reveal a clearing bathed in ethereal light, where fairies gathered around a crystal pool. They beckoned her forward, their wings shimmering with colors she'd never seen before. 'We've been waiting,' they sang in chorus. Elara stepped forward, her heart racing with both fear and wonder. The journey that began with curiosity would transform her understanding of her world forever.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Jordan Lee",
    authorId: "user-1",
    isPublic: true,
    likes: 128,
    comments: 34,
    shares: 12,
    params: {
      ageGroup: "Children",
      genre: "Fantasy",
      characters: "Elara",
      pronouns: "she/her",
      setting: "Enchanted Forest",
      theme: "Discovery",
      additionalDetails: "",
    }
  },
  {
    id: "story-2",
    title: "Neon Dreams",
    content: "The city buzzed with electric energy as holograms lit up the perpetual night. Sentinel towers reflected the neon glow of endless advertisements, while drones patrolled between the mega-structures. In this world of technological wonders, Raven moved like a ghost, invisible to the grid. The neural chip in her wrist contained the most valuable code in the system—a key that could either save humanity from digital enslavement or plunge it deeper into corporate control. The rain began to fall, washing away her digital footprints as she made her way to the rendezvous point.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Alex Rivera",
    authorId: "user-2",
    isPublic: true,
    likes: 95,
    comments: 27,
    shares: 8,
    params: {
      ageGroup: "Teens",
      genre: "Science Fiction",
      characters: "Raven",
      pronouns: "she/her",
      setting: "Cyberpunk City",
      theme: "Freedom",
      additionalDetails: "",
    }
  },
  {
    id: "story-3",
    title: "The Silent Observer",
    content: "The case seemed straightforward until I found the journal hidden in the floorboards. Each entry more disturbing than the last, revealing a pattern only visible to someone who knew where to look. The victim wasn't random—they knew too much. As I turned the final page, the floorboard behind me creaked. Someone was in the house with me, watching silently, waiting for me to discover the truth they'd worked so hard to bury. Now we were in a deadly game of chess, and they'd already made their move.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Morgan Williams",
    authorId: "user-3",
    isPublic: true,
    likes: 156,
    comments: 42,
    shares: 18,
    params: {
      ageGroup: "Adults",
      genre: "Mystery",
      characters: "Detective",
      pronouns: "they/them",
      setting: "Abandoned House",
      theme: "Secrets",
      additionalDetails: "",
    }
  }
];

// Sample comments data structure is now imported from CommentManager

const ShareStories = () => {
  const { isSignedIn, userId } = useAuth();
  const [stories, setStories] = useState<SharedStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest");
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStoryContent, setNewStoryContent] = useState("");
  const [comments, setComments] = useState<StoryComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    // Simulate fetching stories from an API
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        // Load published stories from localStorage and merge with examples
        const publishedStories = JSON.parse(localStorage.getItem('publishedStories') || '[]');
        const allStories = [...publishedStories, ...exampleSharedStories];
        
        // In a real app, this would be an API call
        setTimeout(() => {
          setStories(allStories);
          // Generate some sample comments
          const sampleComments: StoryComment[] = [
            {
              id: "comment-1",
              storyId: "story-1",
              author: "Taylor Smith",
              authorId: "user-4",
              content: "This was such a magical story! I loved the descriptions of the fairy world.",
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: "comment-2",
              storyId: "story-2",
              author: "Jamie Parker",
              authorId: "user-5",
              content: "The cyberpunk setting is so vividly described. I could practically see the neon lights!",
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          setComments(sampleComments);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching stories:", error);
        toast({
          title: "Error",
          description: "Could not load community stories",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const onStoryAction = (action: string, storyId: string) => {
    handleStoryAction(action, storyId, stories, setStories, setSelectedStoryId, setIsCommenting, isSignedIn);
  };

  const onPostStory = () => {
    handlePostStory(newStoryTitle, newStoryContent, isSignedIn, userId, stories, setStories, setNewStoryTitle, setNewStoryContent, setIsDialogOpen);
  };

  const onPostComment = () => {
    handlePostComment(newComment, selectedStoryId, isSignedIn, userId, comments, setComments, stories, setStories, setNewComment, setIsCommenting);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-storyforge-background to-white">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <CommunityStoriesHeader 
          isSignedIn={isSignedIn}
          onCreateStory={() => setIsDialogOpen(true)}
        />
        
        <section className="mb-12">
          <Tabs defaultValue="create">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="create">Enhance Your Stories</TabsTrigger>
              <TabsTrigger value="share">Community Stories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6">
              <EnhanceStoriesSection />
            </TabsContent>
            
            <TabsContent value="share" className="space-y-6" id="community-stories">
              <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">Browse Community Stories</h2>
                
                <StoryFilters 
                  activeTab={activeTab}
                  onFilterChange={setActiveTab}
                />
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-storyforge-purple" />
                    <span className="ml-2 text-storyforge-purple">Loading stories...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {stories.length > 0 ? (
                      <StoryTable stories={stories} onStoryAction={onStoryAction} />
                    ) : (
                      <div className="text-center p-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No stories found. Be the first to publish!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    onStoryAction={onStoryAction} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      {/* Comment Dialog */}
      <CommentDialog
        isOpen={isCommenting}
        onClose={() => setIsCommenting(false)}
        comment={newComment}
        onCommentChange={setNewComment}
        onPostComment={onPostComment}
      />

      <PublishStoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={newStoryTitle}
        content={newStoryContent}
        onTitleChange={setNewStoryTitle}
        onContentChange={setNewStoryContent}
        onPublish={onPostStory}
      />

      <Footer />
    </div>
  );
};

export default ShareStories;
