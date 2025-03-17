import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Book, Clock, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { SavedStory } from '@/types/story';
import { getSavedStories, deleteStory } from '@/utils/authUtils';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type SavedStoriesProps = {
  onSelectStory?: (story: SavedStory) => void;
};

const SavedStories: React.FC<SavedStoriesProps> = ({ onSelectStory }) => {
  const { toast } = useToast();
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 3;
  
  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const loadedStories = await getSavedStories();
        setStories(loadedStories);
      } catch (error) {
        console.error("Error loading stories:", error);
        toast({
          title: "Error",
          description: "Failed to load stories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadStories();
  }, [toast]);
  
  // Get current page stories
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory);
  const totalPages = Math.ceil(stories.length / storiesPerPage);
  
  const handleDelete = async (storyId: string) => {
    try {
      const success = await deleteStory(storyId);
      if (success) {
        setStories(stories.filter(story => story.id !== storyId));
        toast({
          title: "Story deleted",
          description: "Your story has been removed from your library",
        });
        
        // Adjust current page if needed
        if (currentStories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete story",
        variant: "destructive",
      });
    }
  };
  
  const handleLoadStory = (story: SavedStory) => {
    if (onSelectStory) {
      onSelectStory(story);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Book className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">Loading saved stories...</h3>
        </div>
      </div>
    );
  }
  
  if (stories.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Book className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No saved stories</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your saved stories will appear here.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-5 p-2">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="card">Card View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4 mt-4">
          {currentStories.map((story) => (
            <div key={story.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex-1 mr-4">
                <h4 className="font-medium">{story.title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(story.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleLoadStory(story)}
                >
                  Load
                </Button>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      Preview
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>{story.title}</DrawerTitle>
                      <DrawerDescription>
                        Created on {formatDate(story.createdAt)}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 pt-0 font-serif max-h-[50vh] overflow-y-auto space-y-4">
                      {story.content.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    <DrawerFooter>
                      <Button onClick={() => handleLoadStory(story)}>
                        Load Story
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(story.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="card" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStories.map((story) => (
              <Card key={story.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(story.createdAt)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-700">
                    {truncateText(story.content, 100)}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLoadStory(story)}
                  >
                    Load
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(story.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SavedStories;
