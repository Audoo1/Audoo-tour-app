export interface Tour {
  id: string;
  place: string;
  city: string;
  country: string;
  image: string;
  audio1min: string;
  audio10min: string;
}

export interface TourCardProps {
  tour: Tour;
}

export interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration: string;
  onAudioChange: (audioUrl: string, duration: string) => void;
}

export interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
} 