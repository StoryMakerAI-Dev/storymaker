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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXPORT_TEMPLATES, getTemplate } from '@/utils/exportTemplates';
import { Printer, Download } from 'lucide-react';

interface PrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  onExport: (format: 'pdf' | 'docx', templateId: string) => void;
}

const PrintPreviewDialog: React.FC<PrintPreviewDialogProps> = ({
  open,
  onOpenChange,
  title,
  content,
  onExport,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx'>('pdf');

  const template = getTemplate(selectedTemplate);
  const watermark = 'Created with StoryMaker AI';

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    onExport(exportFormat, selectedTemplate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Print Preview</DialogTitle>
          <DialogDescription>
            Preview and customize your story export
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'pdf' | 'docx') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Template Style</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
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
            <p className="text-xs text-muted-foreground">{template.description}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto border rounded-lg p-6 bg-background">
          <div
            className="max-w-3xl mx-auto bg-white text-black p-8 shadow-lg"
            style={{
              fontFamily: template.pdf.fontFamily,
              fontSize: `${template.pdf.fontSize}px`,
              lineHeight: template.pdf.lineHeight,
            }}
          >
            <h1
              className="mb-6 font-bold border-b-2 border-primary pb-3"
              style={{ fontSize: `${template.pdf.titleSize}px` }}
            >
              {title}
            </h1>
            {content.split('\n\n').map((para, idx) => (
              <p key={idx} className="mb-4 text-justify">
                {para}
              </p>
            ))}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-gray-600 italic text-sm">
              {watermark}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export as {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintPreviewDialog;
