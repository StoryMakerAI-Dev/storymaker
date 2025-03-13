
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Book, Download, Sparkles } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface StoryDisplayProps {
  title: string;
  content: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, content }) => {
  const { toast } = useToast();
  const storyRef = useRef<HTMLDivElement>(null);
  
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
        
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end">
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
  );
};

export default StoryDisplay;
