# Voxtrav - Immersive Audio Tours & Travel Guides

A modern web application for discovering and experiencing immersive audio tours of amazing places around the world. Your voice-guided travel companion for authentic local stories and hidden gems.

## 🌟 Features

- 🎧 **Immersive Audio Tours**: Professional voice guides with 1-minute and 10-minute options
- ⚡ **Flexible Speed Control**: Adjust playback speed (0.5x to 2x) to match your pace
- 🔖 **Bookmark System**: Save your favorite tours for later
- 📊 **Tour History**: Track your completed tours and listening progress
- 👤 **User Profiles**: Personal preferences and tour statistics
- 🔍 **Smart Search**: Find tours by place, city, or country
- 📱 **Responsive Design**: Perfect experience on desktop and mobile
- 🎨 **Modern UI**: Beautiful, intuitive interface with Tailwind CSS
- ☁️ **Vercel Blob**: Optimized media storage for fast loading

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Deployment**: Netlify
- **Media Storage**: Vercel Blob Storage
- **Domain**: voxtrav.info

## 🚀 Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for authentication and database)
- Vercel account (for Blob Storage)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd voxtrav
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

4. Set up Supabase:
   - Create a Supabase project
   - Run the SQL scripts in `supabase_tables.sql`
   - Configure authentication settings

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Management

The app uses static JSON files for tour data, making it simple and reliable.

### JSON Format

Your tour data should be stored in `src/data/tours.json` with the following structure:

```json
[
  {
    "id": "unique-tour-id",
    "place": "Place Name",
    "city": "City Name",
    "country": "Country Name",
    "image": "https://your-project.public.blob.vercel-storage.com/image.jpg",
    "audio1min": "https://your-project.public.blob.vercel-storage.com/audio-1min.mp3",
    "audio10min": "https://your-project.public.blob.vercel-storage.com/audio-10min.mp3"
  }
]
```

### Updating Data

1. Edit the `src/data/tours.json` file
2. Add new tours or modify existing ones
3. Redeploy to see changes

## 🎵 Audio Features

### Speed Control
- **0.5x**: Slow for detailed listening
- **0.75x**: Relaxed pace
- **1x**: Normal speed
- **1.25x**: Slightly faster
- **1.5x**: Fast listening
- **2x**: Very fast for quick overview

### Audio Quality
- High-quality voice recordings
- Professional narration
- Local stories and history
- Authentic experiences

## 🔐 Authentication & User Features

### User Accounts
- Email/password registration
- Secure authentication with Supabase
- Profile management
- Tour bookmarks
- Listening history

### User Preferences
- Default audio speed
- Volume settings
- Tour completion tracking
- Personal statistics

## 📱 Media Files with Vercel Blob

### Uploading Files

1. **Using the utility function:**
```typescript
import { uploadToVercelBlob } from '@/utils/vercelBlob';

const file = // your file input
const url = await uploadToVercelBlob(file);
```

2. **Manual upload:**
   - Go to your Vercel dashboard
   - Navigate to Storage > Blob
   - Upload your files
   - Copy the public URLs

### Supported File Types

- **Images**: JPG, PNG, WebP, AVIF
- **Audio**: MP3, WAV, OGG, M4A
- **Video**: MP4, WebM (if needed)

## 🌐 Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob token
4. Deploy!

### Domain Configuration

1. **Add custom domain**: voxtrav.info
2. **Update Supabase settings**:
   - Site URL: `https://voxtrav.info`
   - Redirect URLs: `https://voxtrav.info/profile`, `https://voxtrav.info/auth/callback`
3. **SSL certificate**: Automatically provided by Netlify

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Homepage
│   ├── tour/[id]/      # Tour detail pages
│   ├── profile/        # User profile
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── Auth/          # Authentication components
│   ├── Home/          # Homepage components
│   ├── Layout/        # Layout components
│   ├── Tour/          # Tour-specific components
│   └── UI/            # Reusable UI components
├── lib/               # Library files
│   ├── supabase.ts    # Supabase client
│   └── userService.ts # User data management
├── types/             # TypeScript type definitions
├── data/              # Static data files
│   └── tours.json     # Tour data
└── utils/             # Utility functions
    └── vercelBlob.ts  # Vercel Blob utilities
```

## 🔧 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob storage token

## 🐛 Troubleshooting

### Audio/Image Not Loading
- Ensure files are uploaded to Vercel Blob Storage
- Check that URLs are correct in your JSON file
- Verify your `BLOB_READ_WRITE_TOKEN` is set correctly

### Authentication Issues
- Check Supabase configuration
- Verify environment variables
- Ensure redirect URLs are set correctly

### Build Errors
Make sure you're using Node.js 18+ and have all dependencies installed correctly.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 About Voxtrav

Voxtrav is your voice-guided travel companion, bringing destinations to life through immersive audio experiences. Discover hidden stories, local secrets, and authentic experiences that go beyond typical tourist guides.

**Visit us at**: [voxtrav.info](https://voxtrav.info) 