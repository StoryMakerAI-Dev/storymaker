
import { StoryParams } from "../types/story";
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

export const validateInputs = (params: StoryParams): boolean => {
  if (!params.characters.trim()) {
    toast({
      title: "Missing information",
      description: "Please provide main characters for your story.",
      variant: "destructive",
    });
    return false;
  }
  
  if (!params.setting.trim()) {
    toast({
      title: "Missing information",
      description: "Please provide a setting for your story.",
      variant: "destructive",
    });
    return false;
  }
  
  if (!params.theme.trim()) {
    toast({
      title: "Missing information",
      description: "Please provide a theme or lesson for your story.",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

export const generateMockTitle = (params: StoryParams): string => {
  const mainCharacter = params.characters.split(' and ')[0] || params.characters.split(',')[0] || "Hero";
  const cleanedMainCharacter = mainCharacter.trim().replace(/^a |^an |^the /i, '');
  const setting = params.setting || "Magical Land";
  
  const titlePrefixes = [
    "The Adventure of",
    "The Tale of",
    "The Journey of",
    "The Quest of",
    "The Story of"
  ];
  
  const titleConnectors = [
    "in the",
    "and the",
    "of the",
    "beyond the"
  ];
  
  const prefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  const connector = titleConnectors[Math.floor(Math.random() * titleConnectors.length)];
  
  return `${prefix} ${cleanedMainCharacter} ${connector} ${setting}`;
};

export const getPronouns = (pronounString: string): {
  subject: string,
  object: string,
  possessive: string,
  reflexive: string
} => {
  // Define the pronoun sets with they/them support
  const pronounPairs: {[key: string]: {subject: string, object: string, possessive: string, reflexive: string}} = {
    "she/her": { subject: "she", object: "her", possessive: "her", reflexive: "herself" },
    "he/him": { subject: "he", object: "him", possessive: "his", reflexive: "himself" },
    "they/them": { subject: "they", object: "them", possessive: "their", reflexive: "themselves" }
  };
  
  // Default to they/them for custom pronouns or if pronouns are not recognized
  let pronounSet = pronounPairs["they/them"];
  
  // Check if the pronouns are in our predefined pairs
  if (pronounString in pronounPairs) {
    pronounSet = pronounPairs[pronounString];
  }
  
  return pronounSet;
};

export const generateStoryContent = (params: StoryParams): { title: string, story: string } => {
  const title = generateMockTitle(params);
  const pronounSet = getPronouns(params.pronouns);
  
  // Generate story based on age group
  const storyIntros = {
    children: `Once upon a time in a land far away, where the trees whispered secrets and the rivers sang lullabies, there lived a group of extraordinary friends. ${params.characters || "A brave little fox and a wise old owl"} were known throughout the ${params.setting || "enchanted forest"} for ${pronounSet.possessive} incredible adventures.

One sunny morning, as golden rays filtered through the leaves, our heroes discovered something unusual—a glowing map that appeared out of nowhere! The map showed the way to ${params.theme || "a hidden treasure that could grant one wish to whoever found it"}.

"Should we follow it?" asked the ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "fox"}, eyes wide with excitement.

The ${params.characters ? (params.characters.split(' and ')[1] || "friend").replace(/^a |^an |^the /i, '') : "owl"} nodded wisely. "Every great adventure begins with a single step," ${pronounSet.subject} hooted.

And so, ${pronounSet.possessive} journey began...`,

    teens: `The summer that changed everything started like any other in ${params.setting || "the sleepy coastal town of Azuremist"}. ${params.characters || "Sixteen-year-old Jamie and best friends Kai and Lena"} had no idea that ${pronounSet.possessive} lives were about to take an unexpected turn.

It was the strange lights over the abandoned lighthouse that first caught ${pronounSet.possessive} attention. No one else seemed to notice them—swirling, pulsating colors that appeared only at midnight.

"We should check it out," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Jamie"} said, already knowing the others would agree. They always did when it came to adventures.

What ${pronounSet.subject} discovered inside the lighthouse would unveil secrets about ${params.theme || "their town's history and their own mysterious connections to it"}. As ${pronounSet.subject} climbed the winding staircase, the air grew thick with anticipation...`,

    adults: `The rain fell in relentless sheets as ${params.characters || "Dr. Eleanor Reeves"} stood at the crossroads of what was and what could be. Three years of research had led to this moment—this decision. The ${params.setting || "ancient manuscript"} lay open on the desk, its secrets finally revealed after centuries of silence.

"You don't have to do this," came a voice from the doorway. ${params.characters ? (params.characters.split(' and ')[1] || "Professor Martin").replace(/^a |^an |^the /i, '') : "Professor Martin"} stood there, concern etched across ${pronounSet.possessive} weathered face.

"We both know that's not true," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"} replied, fingers tracing the symbols that promised ${params.theme || "answers to questions humanity wasn't supposed to ask"}.

Some boundaries weren't meant to be crossed, but the allure of forbidden knowledge had always been humanity's greatest weakness. And perhaps, ${pronounSet.possessive} greatest strength...`
  };
  
  const additionalParagraphs = {
    children: `
As they ventured deeper into the ${params.setting || "enchanted forest"}, the trees grew taller and the colors more vibrant. Flowers of every hue lined the path, some even greeting ${pronounSet.object} with tiny nods as ${pronounSet.subject} passed by!

"Look!" exclaimed the ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "fox"}, pointing to a clearing ahead. There, bathed in dappled sunlight, stood a circle of mushrooms with tiny doors and windows. It was a village! Tiny creatures with leafy hats peeked out curiously.

An elderberry fairy with gossamer wings approached ${pronounSet.object}. "Welcome, travelers! We've been expecting you," she said with a tinkling laugh. "The treasure you seek is not just gold and jewels, but something far more precious—it's the magic of friendship and courage!"

The ${params.characters ? (params.characters.split(' and ')[1] || "companion").replace(/^a |^an |^the /i, '') : "owl"} looked thoughtful. "Sometimes the greatest treasures are the ones we discover within ${pronounSet.reflexive} during the journey," ${pronounSet.subject} said wisely.

With new friends and a map full of wonders, our heroes continued ${pronounSet.possessive} adventure, ready for whatever magic awaited ${pronounSet.object} just beyond the next hill.`,

    teens: `
The lighthouse keeper's journal revealed a truth that made ${pronounSet.possessive} blood run cold. A hundred years ago, on this very day, ${params.theme || "three teenagers just like them had discovered the gateway—a tear in reality that appeared only during the lunar eclipse. None of them ever returned."} 

"We should tell someone about this," ${params.characters ? (params.characters.split(' and ')[1] || "friend").replace(/^a |^an |^the /i, '') : "Kai"} suggested, but the determination in ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Jamie"}'s eyes said otherwise.

"No one would believe us," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Jamie"} replied, turning the brittle pages. "Besides, look at this—it says they left something behind, something important."

The journal contained a map, marked with symbols matching the strange birthmarks they'd all shared since childhood. Coincidence? Hardly.

As night fell and the moon began to darken, ${pronounSet.subject} made ${pronounSet.possessive} choice. Sometimes destiny isn't about what happens to you, but about what you choose to confront.`,

    adults: `
The implications were staggering. If ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"}'s theory was correct, ${params.theme || "history as they knew it was built on carefully constructed lies. Ancient civilizations hadn't collapsed—they had transcended."} 

"Have you considered the consequences?" ${params.characters ? (params.characters.split(' and ')[1] || "colleague").replace(/^a |^an |^the /i, '') : "Professor Martin"} asked, pouring amber liquid into two glasses. "There are powers that would kill to keep this hidden."

"Is that a threat or a warning?" ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"} took the offered drink, studying ${pronounSet.possessive} expression carefully.

"Does it matter?" ${pronounSet.subject} countered. "You've aligned ${pronounSet.reflexive} with forces beyond our understanding. The manuscript isn't just a document—it's a key."

Outside, the storm intensified as if mirroring the tempest of moral ambiguity that surrounded ${pronounSet.object}. Truth had always been valued above all else in academic circles, but some truths came with a price that extended beyond reputations and careers.

"Tomorrow, we cross the point of no return," ${params.characters ? params.characters.split(' and ')[0].replace(/^a |^an |^the /i, '') : "Eleanor"} said, making ${pronounSet.possessive} decision. "The world deserves to know what lies behind the veil."
`
  };
  
  const ageGroup = params.ageGroup as keyof typeof storyIntros;
  const story = storyIntros[ageGroup] + "\n\n" + additionalParagraphs[ageGroup];
  
  // Apply grammar check
  const correctedStory = performGrammarCheck(story);
  
  return { title, story: correctedStory };
};
