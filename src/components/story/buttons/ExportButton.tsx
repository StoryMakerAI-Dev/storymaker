import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jsPDF } from 'jspdf';
import { Document, Paragraph, Packer, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface ExportButtonProps {
  title: string;
  content: string;
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ title, content, disabled }) => {
  const exportAsText = () => {
    const watermark = '\n\n---\nCreated with StoryMaker AI\n';
    const blob = new Blob([`${title}\n\n${content}${watermark}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { 
      font-family: Georgia, serif; 
      max-width: 800px; 
      margin: 50px auto; 
      padding: 20px;
      line-height: 1.6;
    }
    h1 { 
      color: #333; 
      border-bottom: 2px solid #4A90E2;
      padding-bottom: 10px;
    }
    p { 
      margin: 1em 0; 
      text-align: justify;
    }
    .watermark {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 14px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${content.split('\n\n').map(para => `<p>${para}</p>`).join('\n')}
  <div class="watermark">Created with StoryMaker AI</div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    const watermark = '\n\n---\nCreated with StoryMaker AI';
    
    // Set title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Set content
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(content + watermark, 170);
    doc.text(splitContent, 20, 40);
    
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const exportAsDOCX = async () => {
    const watermark = '\n\n---\nCreated with StoryMaker AI';
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
          }),
          ...content.split('\n\n').map(para => 
            new Paragraph({
              children: [new TextRun(para)],
              spacing: { after: 200 },
            })
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: watermark,
                italics: true,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_')}.docx`);
  };

  const exportAsMarkdown = () => {
    const watermark = '\n\n---\n*Created with StoryMaker AI*';
    const markdown = `# ${title}\n\n${content}${watermark}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const watermark = '\n\n---\nCreated with StoryMaker AI\n';
    navigator.clipboard.writeText(`${title}\n\n${content}${watermark}`);
  };

  return (
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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportAsText}>
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsHTML}>
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPDF}>
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsDOCX}>
          Export as DOCX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsMarkdown}>
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          Copy to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
