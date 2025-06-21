'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, MapPin, Play } from 'lucide-react';
import Header from '@/components/Layout/Header';
import AudioPlayer from '@/components/Tour/AudioPlayer';
import { Tour } from '@/types/tour';
import toursData from '@/data/tours.json';

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [currentAudio, setCurrentAudio] = useState('');
  const [currentDuration, setCurrentDuration] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTour = () => {
      try {
        setIsLoading(true);
        setError(null);
        const tourId = params.id as string;
        const foundTour = toursData.find(t => t.id === tourId);
        
        if (foundTour) {
          setTour(foundTour);
          // Default to 1 min audio if available
          setCurrentAudio(foundTour.audio1min || foundTour.audio10min || '');
          setCurrentDuration(foundTour.audio1min ? '1 min' : foundTour.audio10min ? '10 min' : '');
        } else {
          setError('Tour not found');
        }
      } catch (err) {
        console.error('Error loading tour:', err);
        setError('Failed to load tour. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTour();
  }, [params.id]);

  const handleAudioChange = (audioUrl: string, duration: string) => {
    setCurrentAudio(audioUrl);
    setCurrentDuration(duration);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tour...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Tour not found'}
            </h1>
            <button
              onClick={() => router.push('/')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Tours
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Info */}
          <div className="space-y-6">
            {/* Image */}
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              {tour.image ? (
                <Image
                  src={tour.image}
                  alt={tour.place}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">No image available</span>
                </div>
              )}
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.place}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{tour.city}, {tour.country}</span>
              </div>
              
              {/* Audio Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Audio Options:</h3>
                <div className="flex flex-wrap gap-3">
                  {tour.audio1min && (
                    <button
                      onClick={() => handleAudioChange(tour.audio1min, '1 min')}
                      className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                        currentAudio === tour.audio1min
                          ? 'bg-primary-100 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      1 min audio
                    </button>
                  )}
                  {tour.audio10min && (
                    <button
                      onClick={() => handleAudioChange(tour.audio10min, '10 min')}
                      className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                        currentAudio === tour.audio10min
                          ? 'bg-primary-100 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      10 min audio
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Audio Player */}
          <div className="lg:sticky lg:top-8">
            {currentAudio ? (
              <AudioPlayer
                audioUrl={currentAudio}
                title={tour.place}
                duration={currentDuration}
                onAudioChange={handleAudioChange}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center">
                <div className="text-gray-400 text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Audio Available</h3>
                <p className="text-gray-600">This tour doesn't have audio content yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 