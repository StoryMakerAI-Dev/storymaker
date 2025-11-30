import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EXPORT_TEMPLATES } from '@/utils/exportTemplates';
import { getUserStories, SavedStoryData } from '@/services/supabase/storyService';
import { useAuth } from '@clerk/clerk-react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportStoryWithTemplate } from '@/utils/exportUtils';

interface BatchExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BatchExportDialog: React.FC<BatchExportDialogProps> = ({ open, onOpenChange }) => {
  const { userId } = useAuth();
  const [stories, setStories] = useState<SavedStoryData[]>([]);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt' | 'html' | 'md'>('pdf');
  const [templateId, setTemplateId] = useState('classic');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      if (!userId || !open) return;
      
      setLoading(true);
      const { data, error } = await getUserStories(userId);
      if (error) {
        toast.error('Failed to load stories');
        console.error(error);
      } else if (data) {
        setStories(data);
      }
      setLoading(false);
    };

    fetchStories();
  }, [userId, open]);

  const toggleStory = (storyId: string) => {
    const newSelection = new Set(selectedStories);
    if (newSelection.has(storyId)) {
      newSelection.delete(storyId);
    } else {
      newSelection.add(storyId);
    }
    setSelectedStories(newSelection);
  };

  const toggleAll = () => {
    if (selectedStories.size === stories.length) {
      setSelectedStories(new Set());
    } else {
      setSelectedStories(new Set(stories.map(s => s.id)));
    }
  };

  const handleExport = async () => {
    if (selectedStories.size === 0) {
      toast.error('Please select at least one story');
      return;
    }

    setExporting(true);
    const selectedStoriesData = stories.filter(s => selectedStories.has(s.id));

    try {
      for (const story of selectedStoriesData) {
        await exportStoryWithTemplate(
          story.title,
          story.content,
          exportFormat,
          templateId
        );
        // Small delay between exports to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      toast.success(`Exported ${selectedStories.size} ${selectedStories.size === 1 ? 'story' : 'stories'} successfully`);
      onOpenChange(false);
      setSelectedStories(new Set());
    } catch (error) {
      toast.error('Failed to export stories');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Batch Export Stories</DialogTitle>
          <DialogDescription>
            Select multiple stories to export in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="txt">Text</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="md">Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(exportFormat === 'pdf' || exportFormat === 'docx') && (
            <div className="space-y-2">
              <Label>Template Style</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between">
            <Label>Select Stories ({selectedStories.size} selected)</Label>
            <Button variant="ghost" size="sm" onClick={toggleAll}>
              {selectedStories.size === stories.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <ScrollArea className="flex-1 border rounded-lg p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No stories found
              </div>
            ) : (
              <div className="space-y-3">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => toggleStory(story.id)}
                  >
                    <Checkbox
                      checked={selectedStories.has(story.id)}
                      onCheckedChange={() => toggleStory(story.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{story.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {story.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={exporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedStories.size === 0 || exporting}>
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {selectedStories.size > 0 && `(${selectedStories.size})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchExportDialog;
