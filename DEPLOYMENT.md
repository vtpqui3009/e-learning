# C# Learning Platform - Deployment Guide

## 🚀 Netlify Deployment

### Prerequisites
1. A [Netlify](https://netlify.com) account
2. A [RapidAPI](https://rapidapi.com) account for Judge0 API (code execution)

### Step 1: Get Judge0 API Key

1. Go to [RapidAPI - Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Sign up / Log in
3. Subscribe to the **Basic (Free)** plan
4. Copy your **X-RapidAPI-Key**

### Step 2: Deploy to Netlify

#### Option A: Deploy via Git (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to Netlify
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables (Site settings → Environment variables):
   - `JUDGE0_API_KEY`: Your RapidAPI key
   - `JUDGE0_API_URL`: `https://judge0-ce.p.rapidapi.com`
   - `JUDGE0_API_HOST`: `judge0-ce.p.rapidapi.com`
7. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set JUDGE0_API_KEY "your_api_key_here"
netlify env:set JUDGE0_API_URL "https://judge0-ce.p.rapidapi.com"
netlify env:set JUDGE0_API_HOST "judge0-ce.p.rapidapi.com"

# Deploy
netlify deploy --prod
```

### Step 3: Verify Deployment

After deployment:
1. Visit your Netlify URL
2. Navigate to any lesson
3. Try running a code example to verify the Judge0 integration

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JUDGE0_API_KEY` | Your RapidAPI key for Judge0 | ✅ Yes |
| `JUDGE0_API_URL` | Judge0 API endpoint | Optional (has default) |
| `JUDGE0_API_HOST` | Judge0 API host header | Optional (has default) |

## 📊 Build Output

The project builds with:
- **23 static lesson pages** (SSG)
- **2 API routes** (serverless functions)
- **~102 KB** shared JS bundle

## 🔒 Security Notes

1. Never commit `.env.local` or real API keys to git
2. The API key is only used server-side (API route)
3. Rate limits apply to the free Judge0 tier

## 🌐 Custom Domain

1. In Netlify: Site settings → Domain management
2. Add your custom domain
3. Netlify handles SSL automatically

## 📈 Performance Tips

- All lesson pages are statically generated at build time
- Code execution happens via serverless functions
- Monaco Editor loads on-demand for code blocks

---

**Ready to deploy!** 🎉
