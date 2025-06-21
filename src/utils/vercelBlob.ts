import { put } from '@vercel/blob';

export async function uploadToVercelBlob(file: File): Promise<string> {
  try {
    const { url } = await put(file.name, file, {
      access: 'public',
    });
    return url;
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload file to Vercel Blob');
  }
}

export function getVercelBlobUrl(path: string): string {
  // If you have a custom domain, replace this with your domain
  return `https://your-project-name.public.blob.vercel-storage.com/${path}`;
}

export function isValidVercelBlobUrl(url: string): boolean {
  return url.includes('public.blob.vercel-storage.com');
} 