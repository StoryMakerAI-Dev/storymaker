import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Download, ExternalLink, HardDrive, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportStoryWithTemplate } from '@/utils/exportUtils';

interface CloudStorageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
}

const CloudStorageDialog: React.FC<CloudStorageDialogProps> = ({
  open,
  onOpenChange,
  title,
  content,
}) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleLocalDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    setExporting(format);
    try {
      await exportStoryWithTemplate(title, content, format, 'classic');
      toast.success(`Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setExporting(null);
    }
  };

  const handleGoogleDrive = () => {
    // Google Drive requires OAuth setup
    toast.info('Google Drive integration requires OAuth setup. Contact support to enable this feature.');
  };

  const handleDropbox = () => {
    // Dropbox requires OAuth setup
    toast.info('Dropbox integration requires OAuth setup. Contact support to enable this feature.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Save to Cloud
          </DialogTitle>
          <DialogDescription>
            Save "{title}" to your preferred storage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleGoogleDrive}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path d="M7.71 3.5L1.15 15l3.43 5.94h6.86L7.71 3.5z" fill="#4285F4"/>
                  <path d="M12.57 8.43l-4.86 6.57h11.14l4.86-6.57H12.57z" fill="#34A853"/>
                  <path d="M17.43 15l-3.43 5.94H20.86L24.29 15H17.43z" fill="#FBBC05"/>
                  <path d="M7.71 3.5l4.86 11.5-4.86 6h6.86l4.86-6-4.86-11.5H7.71z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Google Drive</h4>
                <p className="text-sm text-muted-foreground">Save directly to your Drive</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleDropbox}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#0061FF">
                  <path d="M6 2l6 4-6 4-6-4zm12 0l6 4-6 4-6-4zm-12 12l6-4 6 4-6 4zm12 0l6-4v2l-6 4-6-4v-2z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Dropbox</h4>
                <p className="text-sm text-muted-foreground">Save to your Dropbox</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Download Locally
            </h4>
            <div className="flex gap-2">
              {(['pdf', 'docx', 'txt'] as const).map((format) => (
                <Button
                  key={format}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleLocalDownload(format)}
                  disabled={exporting !== null}
                >
                  {exporting === format ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                      {format.toUpperCase()}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloudStorageDialog;
