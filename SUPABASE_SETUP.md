# Supabase Setup Instructions

## Quick Fix for Current Error

The error you're seeing is because Supabase credentials aren't configured yet. Here's how to fix it:

### 1. Create .env file

```bash
cp .env.example .env
```

### 2. Get your Supabase credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon public** key

### 3. Update .env file

Replace the placeholder values in `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Restart your app

```bash
npx expo start --clear
```

## What This Enables

✅ **Authentication**: Sign up/Sign in with email  
✅ **Data Sync**: Progress syncs across devices  
✅ **Cloud Storage**: All data backed up to Supabase  
✅ **Offline Support**: Works offline, syncs when online

## Current Status

- ✅ Database tables created
- ✅ Authentication system ready
- ✅ Game state sync implemented
- ⏳ **Waiting for your credentials**

Once you add your credentials, the Sign In button will appear in Settings and everything will work seamlessly!
