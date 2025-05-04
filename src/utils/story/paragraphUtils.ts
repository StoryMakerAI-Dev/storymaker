
// Helper function to expand a paragraph with similar content
export const expandParagraph = (paragraph: string): string => {
  const sentences = paragraph.split('. ');
  const lastSentence = sentences[sentences.length - 1];
  
  // Create variations on the last sentence
  const variations = [
    `As this unfolded, everyone could sense the significance of the moment.`,
    `This event would change everything in ways no one could have predicted.`,
    `The air seemed to shimmer with anticipation as events continued to unfold.`,
    `This revelation cast everything in a new light, changing perspectives instantly.`,
    `What happened next would be remembered for generations to come.`,
    `The weight of this realization settled upon everyone present.`,
    `Little did they know how this moment would echo through time.`,
    `It was as if time itself paused to acknowledge the importance of this development.`,
    `This unexpected turn of events opened up new possibilities and paths forward.`,
    `Everything seemed to shift, like puzzle pieces finally falling into place.`
  ];
  
  const randomVariation = variations[Math.floor(Math.random() * variations.length)];
  
  return `${paragraph}. ${randomVariation}`;
};
