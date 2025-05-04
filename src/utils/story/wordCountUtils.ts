
// Helper function to count words in a text
export const countWords = (text: string): number => {
  return text.split(/\s+/).filter(Boolean).length;
};

// Helper function to generate a random conclusion sentence
export const generateConclusionSentence = (): string => {
  const conclusions = [
    "The journey had taught them more than they could have imagined.",
    "With each step forward, new possibilities revealed themselves.",
    "Sometimes, the greatest discoveries come from unexpected places.",
    "In the end, it wasn't about the destination, but the lessons learned along the way.",
    "The bonds formed during their adventure would last a lifetime.",
    "What seemed like an ending was actually just the beginning of something new.",
    "They looked toward the horizon, ready for whatever came next.",
    "The experiences they shared would forever change how they saw the world.",
    "Even in the face of uncertainty, courage guided their path forward.",
    "The wisdom gained through challenges proved more valuable than any treasure.",
    "As one chapter closed, another exciting one waited to be written.",
    "The true magic wasn't in the adventure itself, but in how it transformed them.",
    "Sometimes the longest journeys lead us right back to ourselves.",
    "With newfound confidence, they were ready to face whatever challenges lay ahead.",
    "The memories they created would shine like stars in the darkness.",
  ];
  
  return conclusions[Math.floor(Math.random() * conclusions.length)];
};

// Helper function to adjust text to approximately match target word count
export const adjustTextToWordCount = (text: string, targetWordCount: number): string => {
  const currentWordCount = countWords(text);
  
  // If word count is close enough (within 10% of target), return as is
  if (Math.abs(currentWordCount - targetWordCount) / targetWordCount < 0.1) {
    return text;
  }
  
  // Split text into paragraphs
  const paragraphs = text.split("\n\n");
  
  if (currentWordCount < targetWordCount) {
    // Need to add more content
    const wordsNeeded = targetWordCount - currentWordCount;
    let additionalContent = "";
    
    // Create conclusion paragraph with appropriate length
    const wordsPerSentence = 15; // Average words per sentence
    const sentencesNeeded = Math.ceil(wordsNeeded / wordsPerSentence);
    
    for (let i = 0; i < sentencesNeeded; i++) {
      additionalContent += generateConclusionSentence() + " ";
    }
    
    // Add the new conclusion paragraph
    paragraphs.push(additionalContent.trim());
  } else {
    // Need to reduce content
    while (countWords(paragraphs.join("\n\n")) > targetWordCount && paragraphs.length > 2) {
      // Remove a random paragraph (except first and last)
      const indexToRemove = Math.floor(Math.random() * (paragraphs.length - 2)) + 1;
      paragraphs.splice(indexToRemove, 1);
    }
    
    // If still too long, trim individual paragraphs
    if (countWords(paragraphs.join("\n\n")) > targetWordCount) {
      for (let i = paragraphs.length - 2; i >= 1 && countWords(paragraphs.join("\n\n")) > targetWordCount; i--) {
        const sentences = paragraphs[i].split('. ');
        if (sentences.length > 1) {
          sentences.pop();
          paragraphs[i] = sentences.join('. ') + '.';
        }
      }
    }
  }
  
  return paragraphs.join("\n\n");
};
