# Blob API Setup Instructions

The Vercel Blob API cannot be called directly from the browser due to CORS restrictions. You need to set up a serverless function as a proxy.

## Your Blob Storage Details

Based on your configuration:
- **Music Store ID**: `store_5bRJ5IqFGlJ5lqe4`
- **Music Public URL**: `https://5brj5iqfglj5lqe4.public.blob.vercel-storage.com`
- **Music Token**: Already configured in `.env`

## Option 1: Deploy as Vercel Serverless Function (Recommended)

1. Deploy the `api/blob-list.ts` file to your Vercel project:
   - If deploying to Vercel, the function will be automatically detected
   - The function will be available at: `https://your-project.vercel.app/api/blob-list`

2. Add these environment variables to your `.env` file:
   ```
   MUSIC_URL=https://5brj5iqfglj5lqe4.public.blob.vercel-storage.com
   MUSIC_STORE_ID=store_5bRJ5IqFGlJ5lqe4
   MUSIC_BLOB_READ_WRITE_TOKEN=vercel_blob_rw_5bRJ5IqFGlJ5lqe4_541V0xK4UEfmpeeHyt3PQWq4D0E1r4
   EXPO_PUBLIC_BLOB_API_URL=https://your-project.vercel.app/api/blob-list
   ```

3. If you have video blobs, also add:
   ```
   VIDEO_URL=your-video-blob-public-url
   VIDEO_STORE_ID=your-video-store-id
   VIDEO_BLOB_READ_WRITE_TOKEN=your-video-token
   ```

4. Redeploy your Expo app

## Option 2: Use a separate backend server

If you have a separate backend server, create an endpoint that:
- Accepts GET requests with `Authorization: Bearer <token>` header
- Accepts a `prefix` query parameter
- Calls Vercel Blob API server-side
- Returns the blob list in the same format

Then set `EXPO_PUBLIC_BLOB_API_URL` to your backend endpoint.

## Option 3: Manual file list (Quick workaround)

If you know the blob URLs, you can manually create a list in your code:

```typescript
// In services/blobService.ts, replace getAudioFiles/getVideoFiles with:
export async function getAudioFiles(): Promise<MediaFile[]> {
  // Return hardcoded list of your MP3 files
  return [
    {
      id: 'audio-1',
      url: 'https://your-blob-url.com/file1.mp3',
      filename: 'Artist - Title.mp3',
      title: 'Title',
      artist: 'Artist',
      type: 'audio',
      // ... other fields
    },
    // ... more files
  ];
}
```

