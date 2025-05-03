
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Music, Image, Mic, BookText, Share2, Heart, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@clerk/clerk-react';
import { SharedStory } from '@/types/story';

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

const ShareStories = () => {
  const { toast } = useToast();
  const { isSignedIn, userId } = useAuth();
  const [stories, setStories] = useState<SharedStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest");

  useEffect(() => {
    // Simulate fetching stories from an API
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setStories(exampleSharedStories);
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
  }, [toast]);

  const handleStoryAction = (action: string, storyId: string) => {
    if (!isSignedIn) {
      toast({
        title: "Login required",
        description: `Please login to ${action.toLowerCase()} stories`,
        variant: "destructive",
      });
      return;
    }

    // Find the story and update it
    const updatedStories = stories.map(story => {
      if (story.id === storyId) {
        switch (action) {
          case 'Like':
            return { ...story, likes: story.likes + 1 };
          case 'Comment':
            // In a real app, this would open a comment form
            return story;
          case 'Share':
            return { ...story, shares: story.shares + 1 };
          default:
            return story;
        }
      }
      return story;
    });

    setStories(updatedStories);

    toast({
      title: `Story ${action}d!`,
      description: action === 'Like' ? "You liked this story" : 
                  action === 'Share' ? "Story link copied to clipboard" : 
                  "Comment feature coming soon",
    });

    if (action === 'Share') {
      const story = stories.find(s => s.id === storyId);
      if (story) {
        const shareText = `Check out this story: "${story.title}" by ${story.author}`;
        navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      }
    }
  };

  const filterStories = (filter: string) => {
    setActiveTab(filter);
    // In a real app, this would fetch different stories based on the filter
  };

  const handleExternalLink = (service: string) => {
    switch(service) {
      case 'TextMakerAI':
        window.open("https://preview--textmaker.lovable.app/", "_blank");
        break;
      case 'PictureMakerAI':
        window.open("https://picturemaker.storyforge.ai", "_blank");
        break;
      default:
        toast({
          title: "Coming Soon",
          description: "This feature is currently in development.",
          variant: "default"
        });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-storyforge-background to-white">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
            Community Stories
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore stories shared by our community, or publish your own creations for others to enjoy!
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="default"
              onClick={() => {
                if (!isSignedIn) {
                  toast({
                    title: "Login required",
                    description: "Please login to publish stories",
                    variant: "destructive",
                  });
                  return;
                }
                window.location.href = '/';
              }}
            >
              Create & Publish Your Story
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const storiesSection = document.getElementById('community-stories');
                storiesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Community Stories
            </Button>
          </div>
        </section>
        
        <section className="mb-12">
          <Tabs defaultValue="create">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="create">Enhance Your Stories</TabsTrigger>
              <TabsTrigger value="share">Community Stories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-soft-purple rounded-full">
                      <Music className="h-8 w-8 text-storyforge-purple" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-center mb-2">Add Sound</h2>
                  <p className="text-gray-600 text-center mb-4">Enhance your stories with music and sound effects</p>
                  <Button 
                    className="w-full"
                    onClick={() => handleExternalLink('TextMakerAI')}
                  >
                    Try TextMaker AI
                  </Button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-soft-purple rounded-full">
                      <Image className="h-8 w-8 text-storyforge-purple" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-center mb-2">Add Images</h2>
                  <p className="text-gray-600 text-center mb-4">Illustrate your stories with AI-generated images</p>
                  <Button 
                    className="w-full"
                    onClick={() => handleExternalLink('PictureMakerAI')}
                  >
                    Try PictureMaker AI
                  </Button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-soft-purple rounded-full">
                      <Mic className="h-8 w-8 text-storyforge-purple" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-center mb-2">Text to Speech</h2>
                  <p className="text-gray-600 text-center mb-4">Convert your stories to spoken audio narration</p>
                  <Button 
                    className="w-full"
                    onClick={() => handleExternalLink('TextMakerAI')}
                  >
                    Try TextMaker AI
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-soft-yellow rounded-full">
                    <BookText className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-center mb-2">Word Count Feature</h2>
                <p className="text-gray-600 text-center mb-4">
                  Need a specific word count for your story? Our generator now supports creating stories with custom word counts.
                </p>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      window.location.href = '/';
                    }}
                  >
                    Try the Word Count Feature
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="share" className="space-y-6" id="community-stories">
              <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">Browse Community Stories</h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button 
                    variant={activeTab === "latest" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => filterStories("latest")}
                  >
                    Latest
                  </Button>
                  <Button 
                    variant={activeTab === "popular" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => filterStories("popular")}
                  >
                    Most Popular
                  </Button>
                  <Button 
                    variant={activeTab === "fantasy" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => filterStories("fantasy")}
                  >
                    Fantasy
                  </Button>
                  <Button 
                    variant={activeTab === "scifi" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => filterStories("scifi")}
                  >
                    Sci-Fi
                  </Button>
                  <Button 
                    variant={activeTab === "mystery" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => filterStories("mystery")}
                  >
                    Mystery
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-storyforge-purple" />
                    <span className="ml-2 text-storyforge-purple">Loading stories...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {stories.length > 0 ? (
                      <div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Story</TableHead>
                              <TableHead>Author</TableHead>
                              <TableHead>Published</TableHead>
                              <TableHead>Genre</TableHead>
                              <TableHead>Engagement</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stories.map(story => (
                              <TableRow key={story.id}>
                                <TableCell className="font-medium">
                                  <div className="max-w-xs">
                                    <p className="font-semibold hover:text-storyforge-blue cursor-pointer truncate" 
                                      onClick={() => {
                                        toast({
                                          title: story.title,
                                          description: story.content.substring(0, 100) + "...",
                                        });
                                      }}
                                    >
                                      {story.title}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{story.author}</TableCell>
                                <TableCell>{formatDate(story.createdAt)}</TableCell>
                                <TableCell>{story.params.genre}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <Heart className="h-3 w-3 mr-1" />
                                      {story.likes}
                                    </div>
                                    <div className="flex items-center">
                                      <MessageSquare className="h-3 w-3 mr-1" />
                                      {story.comments}
                                    </div>
                                    <div className="flex items-center">
                                      <Share2 className="h-3 w-3 mr-1" />
                                      {story.shares}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleStoryAction("Like", story.id)}
                                    >
                                      <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleStoryAction("Share", story.id)}
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center p-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No stories found. Be the first to publish!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stories.map((story, index) => (
                  <Card key={story.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-storyforge-blue to-storyforge-purple text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide opacity-80">{story.params.genre} • {story.params.ageGroup}</p>
                          <CardTitle className="mt-1">{story.title}</CardTitle>
                          <CardDescription className="text-white/80 mt-1">by {story.author}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-gray-600 line-clamp-3">{story.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <button 
                          className="flex items-center gap-1 hover:text-storyforge-blue transition-colors"
                          onClick={() => handleStoryAction("Like", story.id)}
                        >
                          <Heart className="h-4 w-4" />
                          <span>{story.likes}</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{story.comments}</span>
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleStoryAction('Share', story.id)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShareStories;
