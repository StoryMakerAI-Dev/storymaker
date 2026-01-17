import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileStack, Calendar, Mail, Cloud } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportStoryWithTemplate } from '@/utils/exportUtils';
import PrintPreviewDialog from './PrintPreviewDialog';
import BatchExportDialog from './BatchExportDialog';
import EmailDeliveryDialog from './EmailDeliveryDialog';
import ScheduledExportsDialog from './ScheduledExportsDialog';
import CloudStorageDialog from './CloudStorageDialog';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

interface ExportButtonProps {
  title: string;
  content: string;
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ title, content, disabled }) => {
  const { user } = useUser();
  const [showPreview, setShowPreview] = useState(false);
  const [showBatchExport, setShowBatchExport] = useState(false);
  const [showEmailDelivery, setShowEmailDelivery] = useState(false);
  const [showScheduledExports, setShowScheduledExports] = useState(false);
  const [showCloudStorage, setShowCloudStorage] = useState(false);

  const handleExportWithTemplate = async (format: 'pdf' | 'docx', templateId: string) => {
    try {
      await exportStoryWithTemplate(title, content, format, templateId);
      toast.success(`Story exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export story');
      console.error(error);
    }
  };

  const handleQuickExport = async (format: 'pdf' | 'docx' | 'txt' | 'html' | 'md') => {
    try {
      await exportStoryWithTemplate(title, content, format, 'classic');
      toast.success(`Story exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export story');
      console.error(error);
    }
  };

  const copyToClipboard = () => {
    const watermark = '\n\n---\nCreated with StoryMaker AI\n';
    navigator.clipboard.writeText(`${title}\n\n${content}${watermark}`);
    toast.success('Story copied to clipboard');
  };

  const senderName = user?.firstName || user?.username || 'A StoryMaker User';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={disabled}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Print Preview & Export
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBatchExport(true)}>
            <FileStack className="h-4 w-4 mr-2" />
            Batch Export Stories
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowScheduledExports(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Exports
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowEmailDelivery(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Send via Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowCloudStorage(true)}>
            <Cloud className="h-4 w-4 mr-2" />
            Save to Cloud
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleQuickExport('pdf')}>
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport('docx')}>
            Export as DOCX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport('txt')}>
            Export as Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport('html')}>
            Export as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport('md')}>
            Export as Markdown
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={copyToClipboard}>
            Copy to Clipboard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PrintPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        title={title}
        content={content}
        onExport={handleExportWithTemplate}
      />

      <BatchExportDialog
        open={showBatchExport}
        onOpenChange={setShowBatchExport}
      />

      <EmailDeliveryDialog
        open={showEmailDelivery}
        onOpenChange={setShowEmailDelivery}
        title={title}
        content={content}
        senderName={senderName}
      />

      <ScheduledExportsDialog
        open={showScheduledExports}
        onOpenChange={setShowScheduledExports}
      />

      <CloudStorageDialog
        open={showCloudStorage}
        onOpenChange={setShowCloudStorage}
        title={title}
        content={content}
      />
    </>
  );
};

export default ExportButton;
