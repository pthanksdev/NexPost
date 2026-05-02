# NexPost - Modern Headless CMS

A full-stack, AI-powered Headless CMS and Blog Platform built with Next.js 14, MongoDB, and NextAuth.

## 🚀 Features

- **MDX Editor**: Split-pane markdown editor with live preview
- **AI Assistant**: Built-in Anthropic Claude 3 for writing, SEO, and spam detection
- **Multi-Platform Social Auto-Posting**: Twitter, LinkedIn, and Threads integration
- **Scheduled Publishing**: Vercel Cron jobs for hands-off publishing
- **Analytics Dashboard**: Insights on post views, comments, and subscribers
- **Role-Based Auth**: Admin, Editor, and Writer roles via NextAuth

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB (Mongoose)
- **Authentication**: NextAuth.js v5 (Google + Credentials)
- **Styling**: Tailwind CSS + Radix UI Primitives
- **State**: Zustand + React Hook Form
- **AI**: Anthropic API

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.local.example` to `.env.local` and fill in your keys:
```bash
cp .env.local.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`

### 4. Setup Vercel Cron (Production)
The scheduled publisher relies on Vercel Cron. Ensure `vercel.json` is configured:
```json
{
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "* * * * *"
    }
  ]
}
```

## 🔐 Environment Setup Guide

- **MONGODB_URI**: Your MongoDB connection string.
- **AUTH_SECRET**: Generate via `npx auth secret`.
- **TOKEN_ENCRYPTION_KEY**: A strong AES-256 key for encrypting social OAuth tokens.
- **GOOGLE_CLIENT_ID/SECRET**: From Google Cloud Console.
- **TWITTER/LINKEDIN/THREADS API KEYS**: From their respective developer portals.
- **ANTHROPIC_API_KEY**: For Claude AI features.
- **CLOUDINARY_***: For image uploads.
# NexPost
