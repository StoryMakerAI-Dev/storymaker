import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EXPORT_TEMPLATES } from '@/utils/exportTemplates';
import { getUserStories } from '@/services/supabase/storyService';
import { exportStoryWithTemplate } from '@/utils/exportUtils';
import { useAuth } from '@clerk/clerk-react';
import { Download, Loader2, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const BulkExportButton = () => {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'docx' | 'txt' | 'html' | 'md'>('pdf');
  const [templateId, setTemplateId] = useState('classic');
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const handleBulkExport = async () => {
    if (!userId) {
      toast.error('Please sign in to export stories');
      return;
    }

    setExporting(true);
    setProgress(0);

    try {
      const { data: stories, error } = await getUserStories(userId);
      if (error) throw error;
      if (!stories || stories.length === 0) {
        toast.error('No stories found to export');
        setExporting(false);
        return;
      }

      setTotal(stories.length);

      for (let i = 0; i < stories.length; i++) {
        await exportStoryWithTemplate(stories[i].title, stories[i].content, format, templateId);
        setProgress(i + 1);
        await new Promise(r => setTimeout(r, 400));
      }

      toast.success(`Exported all ${stories.length} stories successfully!`);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to export stories');
    } finally {
      setExporting(false);
      setProgress(0);
      setTotal(0);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <PackageCheck className="h-4 w-4" />
        Export All Stories
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Export All Stories</DialogTitle>
            <DialogDescription>
              Download all your saved stories at once in your preferred format
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="txt">Text</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="md">Markdown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(format === 'pdf' || format === 'docx') && (
              <div className="space-y-2">
                <Label>Template Style</Label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXPORT_TEMPLATES.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {exporting && total > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Exporting...</span>
                  <span>{progress}/{total}</span>
                </div>
                <Progress value={(progress / total) * 100} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={exporting}>
              Cancel
            </Button>
            <Button onClick={handleBulkExport} disabled={exporting}>
              {exporting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Exporting...</>
              ) : (
                <><Download className="h-4 w-4 mr-2" />Export All</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkExportButton;
