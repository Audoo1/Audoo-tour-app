'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Settings } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration: string;
  onAudioChange: (audioUrl: string, duration: string) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

export default function AudioPlayer({ audioUrl, title, duration, onAudioChange, onAudioStart, onAudioEnd }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset state when audio URL changes
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      onAudioEnd?.();
    };
    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleError = (e: Event) => {
      setIsLoading(false);
      console.error('Audio error:', e);
      setError('Failed to load audio file. Please check the URL and try again.');
    };
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    const handlePlay = () => {
      onAudioStart?.();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('play', handlePlay);
    };
  }, [audioUrl, onAudioStart, onAudioEnd]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (err) {
        console.error('Play error:', err);
        setError('Failed to play audio. Please try again.');
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = audioRef.current?.duration || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        preload="metadata"
      />
      
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">Audio Tour - {duration}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={totalDuration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          disabled={!totalDuration || isLoading}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        {/* Speed Control */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Settings className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{playbackRate}x</span>
          </button>
          
          {showSpeedMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSpeedChange(option.value)}
                  className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                    playbackRate === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={!totalDuration || isLoading || !!error}
          className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white ml-1" />
          )}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3">
        <Volume2 className="h-5 w-5 text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
} 