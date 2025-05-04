
import { toast } from '@/components/ui/use-toast';

// Simple grammar check function
export const performGrammarCheck = (text: string): string => {
  // Replace common grammar issues
  let correctedText = text
    .replace(/ i /g, " I ")
    .replace(/\bi\b/g, "I")
    .replace(/\s\s+/g, " ")
    .replace(/\bi'm\b/g, "I'm")
    .replace(/\bim\b/g, "I'm")
    .replace(/\bdont\b/g, "don't")
    .replace(/\bwont\b/g, "won't")
    .replace(/\bcant\b/g, "can't")
    .replace(/\bit's\b/g, "it's")
    .replace(/\bits\b(?= (a|the|my|your|his|her|their))/g, "it's");
  
  // Ensure periods at end of paragraphs
  correctedText = correctedText.replace(/([a-z])\n/g, "$1.\n");
  
  // Ensure first letter of sentences is capitalized
  correctedText = correctedText.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
  
  return correctedText;
};
