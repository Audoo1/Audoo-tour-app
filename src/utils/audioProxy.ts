// Utility to handle Dropbox audio CORS issues
export function getAudioUrl(originalUrl: string): string {
  // If it's a Dropbox URL, we can try to proxy it
  if (originalUrl.includes('dropbox.com')) {
    // Option 1: Try using a CORS proxy (for development/testing)
    // Note: This is not recommended for production
    // return `https://cors-anywhere.herokuapp.com/${originalUrl}`;
    
    // Option 2: Return the original URL and let the browser handle it
    // The user will see the CORS error but at least we tried
    return originalUrl;
  }
  
  return originalUrl;
}

// Alternative: Create a simple proxy endpoint
export async function proxyAudioUrl(url: string): Promise<string> {
  try {
    // This would require a serverless function to proxy the request
    // For now, we'll return the original URL
    return url;
  } catch (error) {
    console.error('Failed to proxy audio URL:', error);
    return url;
  }
} 