# Quick Start: Deploy Blob API Function

The app needs a serverless function to access Vercel Blob storage. Here's how to set it up:

## Step 1: Deploy the Serverless Function to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the API function**:
   ```bash
   vercel --prod
   ```
   This will deploy your project, and Vercel will automatically detect `api/blob-list.ts` as a serverless function.

4. **Note the deployment URL** - it will look like:
   ```
   https://your-project.vercel.app/api/blob-list
   ```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Import your repository or upload the project
3. Vercel will automatically detect `api/blob-list.ts` in the root directory
4. Deploy the project

## Step 2: Update Your .env File

Add this to your `.env` file:
```bash
EXPO_PUBLIC_BLOB_API_URL=https://your-project.vercel.app/api/blob-list
```

Replace `your-project` with your actual Vercel project name.

## Step 3: Restart Your Expo App

```bash
npm start
# Press 'r' to reload
```

## Troubleshooting

### Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This means the API endpoint doesn't exist yet. Make sure:
1. The serverless function is deployed to Vercel
2. `EXPO_PUBLIC_BLOB_API_URL` is set correctly in your `.env`
3. You've restarted the Expo dev server after updating `.env`

### Check if the function is working:

Visit the API URL directly in your browser:
```
https://your-project.vercel.app/api/blob-list
```

You should get an error about missing authorization, but it should NOT return an HTML page. If you see HTML, the function isn't deployed correctly.

## Temporary Solution (Development Only)

If you just want to test the app UI without the API:

The app will show empty states gracefully when the API is not available. Files simply won't load, but the app won't crash.

