# Audoo - Audio Tour Web App

A modern web application for discovering and experiencing audio tours of amazing places around the world.

## Features

- 🎵 **Audio Tours**: Listen to 1-minute and 10-minute audio guides
- 🔍 **Search**: Find tours by place, city, or country
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Modern UI**: Beautiful, intuitive interface with Tailwind CSS
- 📊 **Static Data**: Tour data stored in JSON format for reliability
- ☁️ **Vercel Blob**: Optimized for Vercel Blob Storage for media files

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Netlify
- **Data**: Static JSON files
- **Media Storage**: Vercel Blob Storage

## Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (for Blob Storage)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Audoo
```

2. Install dependencies:
```bash
npm install
```

3. Set up Vercel Blob Storage:
   - Create a Vercel account at [vercel.com](https://vercel.com)
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel login` and follow the prompts
   - Add your Vercel Blob token to environment variables

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Management

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

## Media Files with Vercel Blob

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

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables:
   - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob token
4. Deploy!

The app includes:
- Next.js optimization
- Static data loading
- Responsive design
- Vercel Blob integration

### Environment Variables

Required for Vercel Blob:
- `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob storage token

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Homepage
│   ├── tour/[id]/      # Tour detail pages
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── Home/          # Homepage components
│   ├── Layout/        # Layout components
│   ├── Tour/          # Tour-specific components
│   └── UI/            # Reusable UI components
├── types/             # TypeScript type definitions
├── data/              # Static data files
│   └── tours.json     # Tour data
├── utils/             # Utility functions
│   └── vercelBlob.ts  # Vercel Blob utilities
```

## Troubleshooting

### Audio/Image Not Loading
- Ensure files are uploaded to Vercel Blob Storage
- Check that URLs are correct in your JSON file
- Verify your `BLOB_READ_WRITE_TOKEN` is set correctly

### Build Errors
Make sure you're using Node.js 18+ and have all dependencies installed correctly.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 