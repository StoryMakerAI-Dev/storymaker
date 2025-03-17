
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Book, Download, Sparkles, X, PencilLine } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

interface StoryDisplayProps {
  title: string;
  content: string;
  onEdit?: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, content, onEdit }) => {
  const { toast } = useToast();
  const storyRef = useRef<HTMLDivElement>(null);
  const [bookMode, setBookMode] = useState<boolean>(false);
  
  const handleDownload = () => {
    try {
      // Create a blob with the story content
      const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
      
      // Trigger a click on the anchor
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Story downloaded!",
        description: "Your story has been saved as a text file.",
      });
    } catch (error) {
      console.error("Error downloading story:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your story.",
        variant: "destructive",
      });
    }
  };

  const paragraphs = content.split('\n\n');

  const toggleBookMode = () => {
    setBookMode(!bookMode);
    
    if (!bookMode) {
      toast({
        title: "Book mode enabled",
        description: "Enjoy a more immersive reading experience.",
      });
      
      // Scroll to the top of the story when entering book mode
      if (storyRef.current) {
        storyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (bookMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-4xl mx-auto bg-amber-50 rounded-lg shadow-2xl overflow-auto max-h-[90vh] relative">
          <button 
            onClick={toggleBookMode}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 z-10"
            aria-label="Close book mode"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="p-12 md:p-16">
            <div className="max-w-prose mx-auto">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center text-gray-800">{title}</h1>
              
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-6 text-lg md:text-xl leading-relaxed font-serif text-gray-700">
                  {paragraph}
                </p>
              ))}
              
              <div className="text-center mt-12 mb-4">
                <Sparkles className="inline-block h-6 w-6 text-storyforge-yellow animate-pulse-slow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-storyforge-blue to-storyforge-purple p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Book className="h-5 w-5" />
            <h3 className="text-sm font-medium uppercase tracking-wider opacity-90">Your Unique Story</h3>
          </div>
          <h2 className="text-3xl font-display font-bold">{title}</h2>
        </div>
        
        <div 
          ref={storyRef}
          className="p-8 story-container"
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="story-text mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
          
          <div className="text-center mt-8 mb-4">
            <Sparkles className="inline-block h-6 w-6 text-storyforge-yellow animate-pulse-slow" />
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch 
              id="book-mode" 
              checked={bookMode}
              onCheckedChange={toggleBookMode}
            />
            <label 
              htmlFor="book-mode" 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Book Mode
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white hover:bg-gray-50"
                onClick={onEdit}
              >
                <PencilLine className="h-4 w-4" />
                <span>Edit Story</span>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              <span>Download Story</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
