'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Settings, Lock, Crown, AlertCircle } from 'lucide-react';
import { audioAccessControl, AudioAccessResult } from '@/lib/audioAccessControl';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration: string;
  tourId: string;
  onAudioChange: (audioUrl: string, duration: string) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

export default function AudioPlayer({ 
  audioUrl, 
  title, 
  duration, 
  tourId,
  onAudioChange, 
  onAudioStart, 
  onAudioEnd 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessResult, setAccessResult] = useState<AudioAccessResult | null>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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
    checkAccess();
    loadAccessInfo();
  }, [tourId]);

  const checkAccess = async () => {
    const result = await audioAccessControl.checkAudioAccess(tourId);
    setAccessResult(result);
  };

  const loadAccessInfo = async () => {
    const info = await audioAccessControl.getAccessInfo();
    setAccessInfo(info);
  };

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
    if (!accessResult?.canAccess) {
      setShowUpgradeModal(true);
      return;
    }

    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
          // Record access when audio starts playing
          await audioAccessControl.recordAudioAccess(tourId);
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

  // Access control overlay
  if (!accessResult?.canAccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">Audio Tour - {duration}</p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium mb-1">Access Restricted</p>
                <p className="text-red-700 text-sm">{accessResult?.reason}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {!accessInfo?.isLoggedIn ? (
              <Link
                href="/signup"
                className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Sign Up to Continue
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Upgrade Your Plan
              </Link>
            )}
            
            {accessInfo?.isLoggedIn && (
              <div className="text-sm text-gray-600">
                <p>Current plan: <span className="font-medium capitalize">{accessInfo.plan}</span></p>
                {accessInfo.plan === 'free' && (
                  <p>Used: {accessInfo.monthlyCount}/3 monthly, {accessInfo.yearlyCount}/5 yearly</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* Access Info */}
        {accessInfo && (
          <div className="mt-3 text-sm">
            {accessInfo.isLoggedIn ? (
              <div className="flex items-center justify-center space-x-4">
                <span className="text-gray-600">
                  Plan: <span className="font-medium capitalize">{accessInfo.plan}</span>
                </span>
                {accessInfo.plan === 'free' && accessInfo.remainingCount !== -1 && (
                  <span className="text-gray-600">
                    Remaining: <span className="font-medium">{accessInfo.remainingCount}</span>
                  </span>
                )}
                {accessInfo.plan === 'premium' && (
                  <span className="flex items-center text-purple-600">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                )}
              </div>
            ) : (
              <div className="text-gray-600">
                Guest access: <span className="font-medium">{accessInfo.remainingCount}</span> tours remaining
              </div>
            )}
          </div>
        )}
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
          disabled={isLoading}
          className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade Your Plan</h3>
              <p className="text-gray-600 mb-6">
                {accessResult?.reason || 'Upgrade to access unlimited audio tours and premium features.'}
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  View Plans
                </Link>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="block w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 