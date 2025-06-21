# Audoo - Audio Tour Web App

A modern web application for discovering and experiencing audio tours of amazing places around the world.

## Features

- 🎵 **Audio Tours**: Listen to 1-minute and 10-minute audio guides
- 🔍 **Search**: Find tours by place, city, or country
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Modern UI**: Beautiful, intuitive interface with Tailwind CSS
- 📊 **Static Data**: Tour data stored in JSON format for reliability

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Netlify
- **Data**: Static JSON files

## Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
    "image": "URL to image",
    "audio1min": "URL to 1-minute audio",
    "audio10min": "URL to 10-minute audio"
  }
]
```

### Updating Data

1. Edit the `src/data/tours.json` file
2. Add new tours or modify existing ones
3. Redeploy to see changes

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Deploy!

The app includes:
- Next.js optimization
- Static data loading
- Responsive design

### Environment Variables

No environment variables are required for basic functionality.

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
└── utils/             # Utility functions
```

## Audio Files

Audio files should be hosted on a service that allows direct streaming (not download). Recommended options:
- Vercel Blob Storage
- AWS S3
- Cloudinary
- Dropbox (with raw=1 parameter)
- Or upload to the `public/` folder for static hosting

## Troubleshooting

### Audio Not Playing
Ensure audio files are hosted on a service that allows direct streaming. Google Drive and Dropbox links often trigger downloads instead of streaming.

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