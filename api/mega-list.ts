// Vercel Serverless Function to list MEGA.nz cloud storage files
// Deploy this as a separate Vercel function

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Mega-Recovery-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get credentials from environment
    const email = process.env.MEGA_EMAIL || '';
    const password = process.env.MEGA_PASSWORD || '';
    const recoveryKey = req.headers['x-mega-recovery-key'] as string || '';
    const fileType = (req.query.type as string) || ''; // 'audio' or 'video'

    if (!email || !password) {
      return res.status(401).json({ 
        error: 'Missing MEGA credentials',
        message: 'MEGA_EMAIL and MEGA_PASSWORD must be set in Vercel environment variables'
      });
    }

    // Use megajs library
    const Mega = require('megajs');
    
    // Login to Mega
    const storage = Mega.login(email, password, {
      recoveryKey: recoveryKey || undefined,
    });

    // Wait for storage to be ready
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('MEGA login timeout')), 30000);
      
      storage.once('ready', () => {
        clearTimeout(timeout);
        resolve();
      });
      
      storage.once('error', (err: Error) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // Get all files from storage
    const allFiles: any[] = [];
    
    // Iterate through all files in the storage
    if (storage.mfiles) {
      storage.mfiles.forEach((file: any) => {
        // t === 0 means it's a file, t === 1 means it's a folder
        if (file.t === 0) {
          allFiles.push(file);
        }
      });
    }
    
    // Filter files by type
    const filteredFiles = allFiles.filter((file: any) => {
      const name = (file.a && file.a.n) ? file.a.n : (file.name || '');
      const lowerName = name.toLowerCase();
      const isAudio = lowerName.endsWith('.mp3') || lowerName.endsWith('.m4a') || 
                      lowerName.endsWith('.wav') || lowerName.endsWith('.flac') ||
                      lowerName.endsWith('.aac') || lowerName.endsWith('.ogg');
      const isVideo = lowerName.endsWith('.mp4') || lowerName.endsWith('.avi') || 
                      lowerName.endsWith('.mov') || lowerName.endsWith('.mkv') ||
                      lowerName.endsWith('.webm') || lowerName.endsWith('.flv');
      
      if (fileType === 'audio') {
        return isAudio;
      } else if (fileType === 'video') {
        return isVideo;
      }
      return isAudio || isVideo;
    });

    // Format files for response
    const formattedFiles = await Promise.all(filteredFiles.map(async (file: any, index: number) => {
      const fileName = (file.a && file.a.n) ? file.a.n : (file.name || `file-${index}`);
      
      // Get download link
      let downloadLink = '';
      try {
        // megajs provides a link() method to get public download links
        if (typeof file.link === 'function') {
          downloadLink = await file.link();
        } else if (file.downloadURL) {
          downloadLink = file.downloadURL;
        }
      } catch (err) {
        console.warn(`Could not get download link for ${fileName}:`, err);
      }
      
      return {
        id: file.h || file.id || `mega-${index}-${fileName}`,
        url: downloadLink,
        pathname: fileName,
        size: file.s || file.size || 0,
        uploadedAt: new Date((file.ts || file.uploadDate || Date.now()) * 1000).toISOString(),
        contentType: fileName.toLowerCase().endsWith('.mp3') ? 'audio/mpeg' :
                     fileName.toLowerCase().endsWith('.mp4') ? 'video/mp4' : '',
      };
    }));

    res.status(200).json({ blobs: formattedFiles });
  } catch (error: any) {
    console.error('Error listing Mega files:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to list Mega files',
      details: 'Make sure MEGA_EMAIL and MEGA_PASSWORD are set in Vercel environment variables'
    });
  }
}
