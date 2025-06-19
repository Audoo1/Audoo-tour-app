# Audoo - Audio Tour Webapp

A modern, responsive web application for exploring destinations through immersive audio tours. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎵 **Spotify-like Audio Player** - Professional audio controls with progress bar and volume control
- 🔍 **Smart Search** - Filter tours by place name, city, or country
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 🗺️ **Location Details** - Rich information about each destination
- ⚡ **Fast Loading** - Optimized for performance

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data**: JSON-based (no database required)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Audoo/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── how-it-works/       # How it works page
│   │   ├── profile/            # Profile page
│   │   └── tour/[id]/          # Tour detail pages
│   ├── components/             # React components
│   │   ├── Layout/             # Layout components
│   │   ├── Home/               # Homepage components
│   │   ├── Tour/               # Tour detail components
│   │   └── UI/                 # Reusable UI components
│   ├── data/                   # Static data
│   │   └── tours.json          # Tour data from Google Sheets
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── tsconfig.json               # TypeScript configuration
```

## Data Structure

The app uses a JSON file (`src/data/tours.json`) with the following structure:

```json
{
  "tours": [
    {
      "id": "unique-tour-id",
      "place": "Tour Name",
      "city": "City Name",
      "country": "Country Name",
      "image": "Google Drive image URL",
      "audio1min": "Google Drive 1-minute audio URL",
      "audio10min": "Google Drive 10-minute audio URL"
    }
  ]
}
```

## Google Drive Integration

The app uses direct Google Drive shareable links for images and audio files. To use your own files:

1. Upload files to Google Drive
2. Get shareable links
3. Update the `tours.json` file with your links
4. Convert links to direct access format:
   - Images: `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`
   - Audio: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: { /* Your primary colors */ },
  secondary: { /* Your secondary colors */ },
  accent: { /* Your accent colors */ }
}
```

### Adding New Tours
1. Add your tour data to `src/data/tours.json`
2. Upload images and audio to Google Drive
3. Update the URLs in the JSON file
4. The app will automatically display new tours

## Features in Detail

### Homepage
- Hero section with app introduction
- Search bar for filtering tours
- Grid of tour cards (shows 8 by default)
- Responsive design for all screen sizes

### Tour Detail Page
- Large featured image
- Location information
- Spotify-like audio player
- Audio duration options (1 min / 10 min)
- Back navigation

### Audio Player
- Play/pause controls
- Progress bar with seeking
- Volume control
- Time display
- Professional styling

### Search Functionality
- Real-time filtering
- Search by place, city, or country
- Results counter
- Load more functionality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images with Next.js Image component
- Lazy loading for better performance
- Minimal bundle size
- Fast page transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the repository. 