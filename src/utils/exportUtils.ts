import { jsPDF } from 'jspdf';
import { Document, Paragraph, Packer, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { getTemplate } from './exportTemplates';

const WATERMARK = '\n\n---\nCreated with StoryMaker AI';

export const exportStoryWithTemplate = async (
  title: string,
  content: string,
  format: 'pdf' | 'docx' | 'txt' | 'html' | 'md',
  templateId: string = 'classic'
) => {
  const filename = title.replace(/[^a-z0-9]/gi, '_');

  switch (format) {
    case 'pdf':
      return exportAsPDF(title, content, templateId, filename);
    case 'docx':
      return exportAsDOCX(title, content, templateId, filename);
    case 'txt':
      return exportAsText(title, content, filename);
    case 'html':
      return exportAsHTML(title, content, filename);
    case 'md':
      return exportAsMarkdown(title, content, filename);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

const exportAsPDF = (title: string, content: string, templateId: string, filename: string) => {
  const template = getTemplate(templateId);
  const doc = new jsPDF();
  
  // Apply template settings
  doc.setFont(template.pdf.fontFamily);
  
  // Title
  doc.setFontSize(template.pdf.titleSize);
  const splitTitle = doc.splitTextToSize(title, 170);
  doc.text(splitTitle, template.pdf.margins.left, template.pdf.margins.top);
  
  // Content
  doc.setFontSize(template.pdf.fontSize);
  const yPosition = template.pdf.margins.top + (splitTitle.length * template.pdf.titleSize * 0.5) + 10;
  const splitContent = doc.splitTextToSize(content + WATERMARK, 170);
  doc.text(splitContent, template.pdf.margins.left, yPosition);
  
  doc.save(`${filename}.pdf`);
};

const exportAsDOCX = async (title: string, content: string, templateId: string, filename: string) => {
  const template = getTemplate(templateId);
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
        }),
        ...content.split('\n\n').map(para => 
          new Paragraph({
            children: [new TextRun({
              text: para,
              font: template.docx.fontFamily,
              size: template.docx.fontSize,
            })],
            spacing: { after: template.docx.paragraphSpacing },
          })
        ),
        new Paragraph({
          children: [
            new TextRun({
              text: WATERMARK,
              italics: true,
              font: template.docx.fontFamily,
              size: template.docx.fontSize - 4,
            }),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
};

const exportAsText = (title: string, content: string, filename: string) => {
  const blob = new Blob([`${title}\n\n${content}${WATERMARK}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportAsHTML = (title: string, content: string, filename: string) => {
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
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportAsMarkdown = (title: string, content: string, filename: string) => {
  const markdown = `# ${title}\n\n${content}\n\n---\n*Created with StoryMaker AI*`;
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
