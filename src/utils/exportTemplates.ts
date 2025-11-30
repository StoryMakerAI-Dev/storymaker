export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  pdf: {
    fontSize: number;
    titleSize: number;
    fontFamily: string;
    lineHeight: number;
    margins: { top: number; right: number; bottom: number; left: number };
  };
  docx: {
    fontSize: number;
    titleSize: number;
    fontFamily: string;
    lineHeight: number;
    paragraphSpacing: number;
  };
}

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional book style with serif fonts',
    pdf: {
      fontSize: 12,
      titleSize: 20,
      fontFamily: 'times',
      lineHeight: 1.6,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
    },
    docx: {
      fontSize: 24,
      titleSize: 48,
      fontFamily: 'Times New Roman',
      lineHeight: 1.5,
      paragraphSpacing: 200,
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimal with sans-serif fonts',
    pdf: {
      fontSize: 11,
      titleSize: 18,
      fontFamily: 'helvetica',
      lineHeight: 1.5,
      margins: { top: 25, right: 25, bottom: 25, left: 25 },
    },
    docx: {
      fontSize: 22,
      titleSize: 44,
      fontFamily: 'Arial',
      lineHeight: 1.4,
      paragraphSpacing: 180,
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Space-efficient format for shorter stories',
    pdf: {
      fontSize: 10,
      titleSize: 16,
      fontFamily: 'helvetica',
      lineHeight: 1.4,
      margins: { top: 15, right: 15, bottom: 15, left: 15 },
    },
    docx: {
      fontSize: 20,
      titleSize: 40,
      fontFamily: 'Calibri',
      lineHeight: 1.3,
      paragraphSpacing: 150,
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated style with generous spacing',
    pdf: {
      fontSize: 13,
      titleSize: 22,
      fontFamily: 'times',
      lineHeight: 1.8,
      margins: { top: 30, right: 30, bottom: 30, left: 30 },
    },
    docx: {
      fontSize: 26,
      titleSize: 52,
      fontFamily: 'Georgia',
      lineHeight: 1.6,
      paragraphSpacing: 240,
    },
  },
];

export const getTemplate = (id: string): ExportTemplate => {
  return EXPORT_TEMPLATES.find(t => t.id === id) || EXPORT_TEMPLATES[0];
};
