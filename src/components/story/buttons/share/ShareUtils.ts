
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
  console.log('Attempting to copy link for story:', storyTitle);
  
  try {
    const shareUrl = generateStoryUrl(storyTitle, storyContent);
    const linkWithInstructions = `${shareUrl}\n\n📖 SCROLL DOWN TO SEE THE AMAZING STORY! 📖`;
    
    console.log('Generated URL:', shareUrl);
    
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      console.log('Clipboard API not available, using fallback');
      throw new Error('Clipboard API not available');
    }
    
    await navigator.clipboard.writeText(linkWithInstructions);
    console.log('Successfully copied to clipboard');
    return { success: true };
  } catch (error) {
    console.error('Error copying link:', error);
    // Fallback for copy if clipboard API fails
    try {
      console.log('Attempting fallback copy method');
      const shareUrl = generateStoryUrl(storyTitle, storyContent);
      const linkWithInstructions = `${shareUrl}\n\n📖 SCROLL DOWN TO SEE THE AMAZING STORY! 📖`;
      
      const textArea = document.createElement('textarea');
      textArea.value = linkWithInstructions;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log('Fallback copy successful');
        return { success: true };
      } else {
        console.error('Fallback copy failed');
        return { success: false };
      }
    } catch (fallbackError) {
      console.error('Fallback copy error:', fallbackError);
      return { success: false };
    }
  }
};
