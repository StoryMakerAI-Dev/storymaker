import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <DropdownMenuItem onClick={copyToClipboard}>
          Copy to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
