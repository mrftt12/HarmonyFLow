# MEGA.nz Cloud Storage Setup

MEGA.nz integration requires server-side authentication. The recovery key alone is not sufficient for API access - you need your email and password.

## Important Security Note

⚠️ **Recovery Key**: The recovery key (`iRF4H-6fC2y55bdFZFLdTQ`) is for account recovery, not direct API authentication. You'll need your MEGA email and password for API access.

## Setup Steps

### Step 1: Deploy the MEGA Serverless Function

1. Deploy `api/mega-list.ts` to Vercel (same as blob-list.ts)

2. Set environment variables in Vercel dashboard:
   - `MEGA_EMAIL` - Your MEGA account email
   - `MEGA_PASSWORD` - Your MEGA account password
   - Optionally: Recovery key in the request header

### Step 2: Configure Environment Variables

**In Vercel Dashboard (Server-side):**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add these (these are server-side only and secure):
   ```
   MEGA_EMAIL=frank@thtank.com
   MEGA_PASSWORD=Fighton15
   ```

**In Your Local .env File (Client-side):**
Add these to your local `.env` file:

```bash
# MEGA.nz Configuration
MUSIC_MEGA_RECOVERY_KEY=iRF4H-6fC2y55bdFZFLdTQ
VIDEO_MEGA_RECOVERY_KEY=iRF4H-6fC2y55bdFZFLdTQ

# MEGA API URL (after deploying serverless function)
EXPO_PUBLIC_MEGA_API_URL=https://your-project.vercel.app/api/mega-list
```

⚠️ **Important**: Never commit your `.env` file with passwords. The `.env` file is already in `.gitignore`.

### Step 3: Restart Your App

```bash
npm start
```

## How It Works

1. The app tries **Vercel Blob** first (if configured)
2. If Vercel Blob fails or is not configured, it falls back to **MEGA.nz**
3. The serverless function handles MEGA authentication server-side
4. Files are listed and returned in the same format

## Authentication

The MEGA serverless function uses:
- **Email + Password** for API authentication (required)
- **Recovery Key** as optional header for account recovery

**Note**: Email and password are stored securely in Vercel environment variables, not in your client app.

## Troubleshooting

### Error: "Missing MEGA credentials"
- Set `MEGA_EMAIL` and `MEGA_PASSWORD` in Vercel environment variables
- These are server-side only, not in your `.env` file

### Error: "API endpoint not available"
- Deploy the `api/mega-list.ts` function to Vercel
- Set `EXPO_PUBLIC_MEGA_API_URL` in your `.env` file

### Files not loading
- Check that files are in your MEGA account
- Verify MEGA email/password are correct in Vercel
- Check browser console for detailed error messages

