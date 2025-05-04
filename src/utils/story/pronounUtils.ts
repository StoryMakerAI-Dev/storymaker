
export const getPronouns = (pronounString: string): {
  subject: string,
  object: string,
  possessive: string,
  reflexive: string
} => {
  // Default to they/them if pronouns string is empty or invalid
  if (!pronounString) {
    return { subject: "they", object: "them", possessive: "their", reflexive: "themselves" };
  }

  // If there are multiple characters with different pronouns, use the first character's pronouns
  const firstPronoun = pronounString.split(',')[0];
  
  // Define the pronoun sets
  const pronounPairs: {[key: string]: {subject: string, object: string, possessive: string, reflexive: string}} = {
    "she/her": { subject: "she", object: "her", possessive: "her", reflexive: "herself" },
    "he/him": { subject: "he", object: "him", possessive: "his", reflexive: "himself" },
    "they/them": { subject: "they", object: "them", possessive: "their", reflexive: "themselves" }
  };
  
  // Check if the pronouns are in our predefined pairs
  if (firstPronoun in pronounPairs) {
    return pronounPairs[firstPronoun];
  }
  
  // Handle custom pronouns by extracting components if possible
  const customParts = firstPronoun.split('/');
  if (customParts.length >= 2) {
    return {
      subject: customParts[0] || "they",
      object: customParts[1] || "them",
      possessive: customParts[2] || customParts[1] || "their",
      reflexive: customParts[3] || (customParts[1] + "self") || "themselves"
    };
  }
  
  // Default to they/them for any other case
  return pronounPairs["they/them"];
};
