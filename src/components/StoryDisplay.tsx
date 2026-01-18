
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Book, Download, Sparkles, X, PencilLine, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { countWords } from '@/utils/storyUtils';

interface StoryDisplayProps {
  title: string;
  content: string;
  coverImageUrl?: string;
  onEdit?: () => void;
  fontClass?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, content, coverImageUrl, onEdit, fontClass = 'font-story' }) => {
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
  const wordCount = countWords(content);

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
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 animate-fade-in overflow-auto">
        <div className="w-full max-w-4xl mx-auto bg-amber-50 rounded-xl shadow-2xl overflow-hidden my-8">
          <button 
            onClick={toggleBookMode}
            className="fixed top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/90 hover:bg-white text-gray-800 z-50 shadow-lg transition-all hover:scale-110"
            aria-label="Close book mode"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="p-8 md:p-12 lg:p-16 max-h-[85vh] overflow-y-auto">
            <div className="max-w-prose mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-8 text-center text-gray-800 leading-tight">{title}</h1>
              
              <div className="prose prose-lg max-w-none">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className={`mb-6 text-lg md:text-xl leading-relaxed font-serif text-gray-700 ${
                    index === 0 ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-amber-700 first-letter:mr-1 first-letter:float-left first-letter:leading-none' : ''
                  }`}>
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="text-center mt-12 mb-4">
                <Sparkles className="inline-block h-6 w-6 text-amber-500 animate-pulse" />
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-8 pb-4">
                {wordCount} words
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden story-card-hover">
        {coverImageUrl && (
          <div className="w-full relative overflow-hidden">
            <img 
              src={coverImageUrl} 
              alt={`Cover for ${title}`}
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        <div className="bg-gradient-to-r from-storyforge-blue via-storyforge-purple to-storyforge-accent p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3 mb-2">
              <Book className="h-6 w-6" />
              <h3 className="text-sm font-semibold uppercase tracking-widest opacity-90">Your Unique Story</h3>
            </div>
            <div className="text-sm font-bold bg-white/25 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg">
              {wordCount} words
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black leading-tight relative">{title}</h2>
        </div>
        
        <div 
          ref={storyRef}
          className="p-10 md:p-12 story-container bg-gradient-to-b from-white to-gray-50/50"
        >
          {paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className={`${fontClass} text-lg md:text-xl mb-8 leading-loose text-gray-800 ${
                index === 0 ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-storyforge-purple first-letter:mr-1 first-letter:float-left' : ''
              }`}
            >
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
