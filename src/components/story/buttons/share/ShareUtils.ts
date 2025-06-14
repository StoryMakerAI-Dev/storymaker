
export const generateStoryUrl = (storyTitle: string, storyContent: string) => {
  const baseUrl = window.location.origin;
  const storyData = {
    title: storyTitle,
    content: storyContent,
    shared: true
  };
  const encodedData = encodeURIComponent(JSON.stringify(storyData));
  return `${baseUrl}/?shared=${encodedData}`;
};

export const copyStoryLink = async (storyTitle: string, storyContent: string) => {
  try {
    const shareUrl = generateStoryUrl(storyTitle, storyContent);
    const linkWithInstructions = `${shareUrl}\n\n📖 SCROLL DOWN TO SEE THE AMAZING STORY! 📖`;
    
    await navigator.clipboard.writeText(linkWithInstructions);
    return { success: true };
  } catch (error) {
    console.error('Error copying link:', error);
    // Fallback for copy if clipboard API fails
    try {
      const shareUrl = generateStoryUrl(storyTitle, storyContent);
      const linkWithInstructions = `${shareUrl}\n\n📖 SCROLL DOWN TO SEE THE AMAZING STORY! 📖`;
      
      const textArea = document.createElement('textarea');
      textArea.value = linkWithInstructions;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return { success: true };
    } catch (fallbackError) {
      return { success: false };
    }
  }
};
