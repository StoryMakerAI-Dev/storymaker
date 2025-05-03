
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Music, Image, Mic, BookText, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ShareStories = () => {
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

  const featuredStories = [
    {
      title: "The Whispering Woods",
      excerpt: "Deep in the forest where trees speak in riddles and shadows dance...",
      author: "Jordan Lee",
      stats: { likes: 128, comments: 34, shares: 12 },
      genre: "Fantasy",
      ageGroup: "Children"
    },
    {
      title: "Neon Dreams",
      excerpt: "The city buzzed with electric energy as holograms lit up the perpetual night...",
      author: "Alex Rivera",
      stats: { likes: 95, comments: 27, shares: 8 },
      genre: "Science Fiction",
      ageGroup: "Teens"
    },
    {
      title: "The Silent Observer",
      excerpt: "The case seemed straightforward until I found the journal hidden in the floorboards...",
      author: "Morgan Williams",
      stats: { likes: 156, comments: 42, shares: 18 },
      genre: "Mystery",
      ageGroup: "Adults"
    }
  ];

  const handleStoryAction = (action: string, title: string) => {
    toast({
      title: `${action} Coming Soon`,
      description: `You'll be able to ${action.toLowerCase()} "${title}" in a future update.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-storyforge-background to-white">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
            Share Your Stories
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Connect with the StoryMaker community! Share your creations and explore what others have made.
          </p>
        </section>
        
        <section className="mb-12">
          <Tabs defaultValue="create">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="create">Create & Enhance</TabsTrigger>
              <TabsTrigger value="share">Browse & Share</TabsTrigger>
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
            
            <TabsContent value="share" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {featuredStories.map((story, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-storyforge-blue to-storyforge-purple text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide opacity-80">{story.genre} • {story.ageGroup}</p>
                          <CardTitle className="mt-1">{story.title}</CardTitle>
                          <CardDescription className="text-white/80 mt-1">by {story.author}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-gray-600">{story.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span>{story.stats.likes} likes</span>
                        <span>{story.stats.comments} comments</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleStoryAction('Share', story.title)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4 text-center">Community Stories</h2>
                <p className="text-gray-600 text-center mb-6">
                  Join our community to share your stories with readers worldwide. Get feedback, collaborate with other writers, and build your audience.
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="default"
                    onClick={() => {
                      toast({
                        title: "Coming soon!",
                        description: "Community publishing will be available soon."
                      });
                    }}
                  >
                    Publish Your Story
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Coming soon!",
                        description: "Community stories will be available soon."
                      });
                    }}
                  >
                    Explore Stories
                  </Button>
                </div>
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
