'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration: string;
  onAudioChange: (audioUrl: string, duration: string) => void;
}

export default function AudioPlayer({ audioUrl, title, duration, onAudioChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = audioRef.current?.duration || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">Audio Tour</p>
      </div>

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
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <SkipBack className="h-6 w-6 text-gray-600" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white ml-1" />
          )}
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <SkipForward className="h-6 w-6 text-gray-600" />
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