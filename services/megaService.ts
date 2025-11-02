import { MUSIC_MEGA_RECOVERY_KEY, VIDEO_MEGA_RECOVERY_KEY } from '@env';

// Dynamic import for megajs since it's a Node.js library
// We'll need to adapt this for React Native

export interface MegaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  downloadUrl?: string;
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

// Note: Mega.js is a Node.js library and may not work directly in React Native
// This is a placeholder that will need server-side implementation
// or use of Mega's REST API if available

export async function getMegaAudioFiles(): Promise<MediaFile[]> {
  const recoveryKey = MUSIC_MEGA_RECOVERY_KEY || '';
  
  if (!recoveryKey) {
    console.warn('MUSIC_MEGA_RECOVERY_KEY not found');
    return [];
  }

  try {
    // TODO: Implement Mega.js integration
    // This requires server-side implementation or REST API approach
    // For now, returning empty array
    console.warn('Mega.js integration requires server-side implementation');
    return [];
  } catch (error) {
    console.error('Error fetching audio files from Mega:', error);
    return [];
  }
}

export async function getMegaVideoFiles(): Promise<MediaFile[]> {
  const recoveryKey = VIDEO_MEGA_RECOVERY_KEY || '';
  
  if (!recoveryKey) {
    console.warn('VIDEO_MEGA_RECOVERY_KEY not found');
    return [];
  }

  try {
    // TODO: Implement Mega.js integration
    // This requires server-side implementation or REST API approach
    // For now, returning empty array
    console.warn('Mega.js integration requires server-side implementation');
    return [];
  } catch (error) {
    console.error('Error fetching video files from Mega:', error);
    return [];
  }
}

