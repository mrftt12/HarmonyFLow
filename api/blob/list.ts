import { list } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const prefix = (req.query.prefix as string) || '';

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const { blobs } = await list({
      token,
      prefix,
    });

    // Return the blobs in a format compatible with our client
    const formattedBlobs = blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt.toISOString(),
      contentType: blob.contentType || '',
    }));

    res.status(200).json({ blobs: formattedBlobs });
  } catch (error: any) {
    console.error('Error listing blobs:', error);
    res.status(500).json({ error: error.message || 'Failed to list blobs' });
  }
}

