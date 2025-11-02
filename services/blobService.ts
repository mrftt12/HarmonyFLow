import { 
  MUSIC_BLOB_READ_WRITE_TOKEN, 
  VIDEO_BLOB_READ_WRITE_TOKEN, 
  MUJSIC_BLOB_READ_WRITE_TOKEN,
  MUSIC_URL,
  VIDEO_URL,
  MUSIC_MEGA_RECOVERY_KEY,
  VIDEO_MEGA_RECOVERY_KEY,
  EXPO_PUBLIC_MEGA_API_URL,
} from '@env';

const MUSIC_TOKEN = MUSIC_BLOB_READ_WRITE_TOKEN || MUJSIC_BLOB_READ_WRITE_TOKEN;
const VIDEO_TOKEN = VIDEO_BLOB_READ_WRITE_TOKEN;
const MUSIC_BLOB_URL = MUSIC_URL || 'https://5brj5iqfglj5lqe4.public.blob.vercel-storage.com';
const VIDEO_BLOB_URL = VIDEO_URL;

export interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  contentType?: string;
}

export interface MediaFile {
  id: string;
  url: string;
  title: string;
  filename: string;
  type: 'audio' | 'video';
  size?: number;
  duration?: string;
  thumbnail?: string;
  artist?: string;
  album?: string;
}

// Parse filename to extract metadata
// Format: "Artist - Title.mp3" or "Artist - Album - Title.mp3"
function parseFilename(filename: string): { title: string; artist?: string; album?: string } {
  const nameWithoutExt = filename.replace(/\.(mp3|mp4)$/i, '');
  const parts = nameWithoutExt.split(' - ');
  
  if (parts.length >= 3) {
    // Artist - Album - Title
    return {
      artist: parts[0].trim(),
      album: parts[1].trim(),
      title: parts.slice(2).join(' - ').trim(),
    };
  } else if (parts.length === 2) {
    // Artist - Title
    return {
      artist: parts[0].trim(),
      title: parts[1].trim(),
    };
  }
  
  return {
    title: nameWithoutExt,
  };
}

// List blobs from Vercel Blob Storage using API proxy
async function listBlobs(token: string, prefix: string = ''): Promise<BlobFile[]> {
  try {
    // Use API route as proxy to avoid CORS issues
    // Set EXPO_PUBLIC_BLOB_API_URL in your .env file to your Vercel function URL
    // Example: https://your-project.vercel.app/api/blob-list
    const apiUrl = process.env.EXPO_PUBLIC_BLOB_API_URL || 
                   (typeof window !== 'undefined' 
                     ? `${window.location.origin}/api/blob/list`
                     : 'https://harmonyflow--u1nr7na0oj.expo.app/api/blob/list');
    
    const response = await fetch(`${apiUrl}?prefix=${encodeURIComponent(prefix)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    // Check if response is HTML (indicating a 404 or error page)
    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    if (!contentType.includes('application/json') || responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
      console.warn('API endpoint returned HTML instead of JSON. The serverless function may not be deployed yet.');
      throw new Error('API endpoint not available. Please deploy the serverless function at api/blob-list.ts to Vercel and set EXPO_PUBLIC_BLOB_API_URL in your .env file.');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Invalid JSON response from API endpoint');
    }
    
    // Handle response from API route
    const blobs = data.blobs || [];
    
    return blobs.map((blob: any) => {
      // If blob URL is relative or doesn't have full URL, construct it from public blob URL
      let url = blob.url || '';
      if (url && !url.startsWith('http')) {
        // Construct full URL if we have the public blob storage URL
        url = `${MUSIC_BLOB_URL || VIDEO_BLOB_URL || ''}/${blob.pathname}`;
      }
      
      return {
        url: url || blob.pathname || '',
        pathname: blob.pathname || '',
        size: blob.size || 0,
        uploadedAt: new Date(blob.uploadedAt || Date.now()),
        contentType: blob.contentType || '',
      };
    });
  } catch (error: any) {
    console.error('Error listing blobs:', error);
    // Return empty array instead of throwing to prevent app crashes
    // The UI will show empty state instead of crashing
    if (error.message?.includes('API endpoint not available')) {
      console.warn('Blob API not configured. Files will not load until serverless function is deployed.');
    }
    throw error;
  }
}

// List files from Mega.nz storage
async function listMegaFiles(type: 'audio' | 'video'): Promise<BlobFile[]> {
  const recoveryKey = (type === 'audio' ? MUSIC_MEGA_RECOVERY_KEY : VIDEO_MEGA_RECOVERY_KEY) || '';
  const apiUrl = EXPO_PUBLIC_MEGA_API_URL || 
                 (typeof window !== 'undefined' 
                   ? `${window.location.origin}/api/mega-list`
                   : '');

  if (!apiUrl) {
    console.warn('EXPO_PUBLIC_MEGA_API_URL not set');
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Mega-Recovery-Key': recoveryKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    if (!contentType.includes('application/json') || responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
      throw new Error('API endpoint not available. Please deploy the serverless function at api/mega-list.ts to Vercel.');
    }

    const data = JSON.parse(responseText);
    const blobs = data.blobs || [];
    
    return blobs.map((blob: any) => ({
      url: blob.url || '',
      pathname: blob.pathname || '',
      size: blob.size || 0,
      uploadedAt: new Date(blob.uploadedAt || Date.now()),
      contentType: blob.contentType || '',
    }));
  } catch (error: any) {
    console.error('Error listing Mega files:', error);
    throw error;
  }
}

// Get audio files from blob storage (tries Vercel Blob first, then Mega)
export async function getAudioFiles(): Promise<MediaFile[]> {
  // Try Vercel Blob first
  if (MUSIC_TOKEN) {
    try {
      const blobs = await listBlobs(MUSIC_TOKEN as string, '');
      const audioFiles = blobs
        .filter(blob => 
          blob.pathname.toLowerCase().endsWith('.mp3') ||
          blob.contentType?.includes('audio') ||
          blob.contentType?.includes('mpeg')
        )
        .map((blob, index) => {
          const parsed = parseFilename(blob.pathname);
          return {
            id: `audio-${index}-${blob.pathname}`,
            url: blob.url,
            filename: blob.pathname,
            title: parsed.title,
            artist: parsed.artist || 'Unknown Artist',
            album: parsed.album,
            type: 'audio' as const,
            size: blob.size,
            thumbnail: undefined,
          };
        });
      
      if (audioFiles.length > 0) {
        return audioFiles;
      }
    } catch (error: any) {
      console.warn('Vercel Blob failed, trying Mega:', error);
    }
  }

  // Try Mega.nz if Vercel Blob failed or not configured
  if (MUSIC_MEGA_RECOVERY_KEY || EXPO_PUBLIC_MEGA_API_URL) {
    try {
      const blobs = await listMegaFiles('audio');
      return blobs
        .filter(blob => 
          blob.pathname.toLowerCase().endsWith('.mp3') ||
          blob.contentType?.includes('audio')
        )
        .map((blob, index) => {
          const parsed = parseFilename(blob.pathname);
          return {
            id: `audio-mega-${index}-${blob.pathname}`,
            url: blob.url,
            filename: blob.pathname,
            title: parsed.title,
            artist: parsed.artist || 'Unknown Artist',
            album: parsed.album,
            type: 'audio' as const,
            size: blob.size,
            thumbnail: undefined,
          };
        });
    } catch (error: any) {
      console.error('Error fetching audio files from Mega:', error);
    }
  }

  // Return empty if both fail
  if (!MUSIC_TOKEN && !MUSIC_MEGA_RECOVERY_KEY) {
    console.warn('No audio storage configured. Set MUSIC_BLOB_READ_WRITE_TOKEN or MUSIC_MEGA_RECOVERY_KEY');
  }
  return [];
}

// Get video files from blob storage (tries Vercel Blob first, then Mega)
export async function getVideoFiles(): Promise<MediaFile[]> {
  // Try Vercel Blob first
  if (VIDEO_TOKEN) {
    try {
      const blobs = await listBlobs(VIDEO_TOKEN as string, '');
      const videoFiles = blobs
        .filter(blob => 
          blob.pathname.toLowerCase().endsWith('.mp4') ||
          blob.contentType?.includes('video') ||
          blob.contentType?.includes('mp4')
        )
        .map((blob, index) => {
          const parsed = parseFilename(blob.pathname);
          return {
            id: `video-${index}-${blob.pathname}`,
            url: blob.url,
            filename: blob.pathname,
            title: parsed.title,
            artist: parsed.artist,
            album: parsed.album,
            type: 'video' as const,
            size: blob.size,
            thumbnail: blob.url, // Use video URL as thumbnail for now
          };
        });
      
      if (videoFiles.length > 0) {
        return videoFiles;
      }
    } catch (error: any) {
      console.warn('Vercel Blob failed, trying Mega:', error);
    }
  }

  // Try Mega.nz if Vercel Blob failed or not configured
  if (VIDEO_MEGA_RECOVERY_KEY || EXPO_PUBLIC_MEGA_API_URL) {
    try {
      const blobs = await listMegaFiles('video');
      return blobs
        .filter(blob => 
          blob.pathname.toLowerCase().endsWith('.mp4') ||
          blob.contentType?.includes('video')
        )
        .map((blob, index) => {
          const parsed = parseFilename(blob.pathname);
          return {
            id: `video-mega-${index}-${blob.pathname}`,
            url: blob.url,
            filename: blob.pathname,
            title: parsed.title,
            artist: parsed.artist,
            album: parsed.album,
            type: 'video' as const,
            size: blob.size,
            thumbnail: blob.url,
          };
        });
    } catch (error: any) {
      console.error('Error fetching video files from Mega:', error);
    }
  }

  // Return empty if both fail
  if (!VIDEO_TOKEN && !VIDEO_MEGA_RECOVERY_KEY) {
    console.warn('No video storage configured. Set VIDEO_BLOB_READ_WRITE_TOKEN or VIDEO_MEGA_RECOVERY_KEY');
  }
  return [];
}

// Get all media files (both audio and video)
export async function getAllMediaFiles(): Promise<{ audio: MediaFile[]; video: MediaFile[] }> {
  const [audio, video] = await Promise.all([
    getAudioFiles(),
    getVideoFiles(),
  ]);

  return { audio, video };
}

// Search media files
export async function searchMediaFiles(query: string): Promise<MediaFile[]> {
  const { audio, video } = await getAllMediaFiles();
  const allMedia = [...audio, ...video];
  const lowerQuery = query.toLowerCase();

  return allMedia.filter(media => 
    media.title.toLowerCase().includes(lowerQuery) ||
    media.artist?.toLowerCase().includes(lowerQuery) ||
    media.filename.toLowerCase().includes(lowerQuery)
  );
}
