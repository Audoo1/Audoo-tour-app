'use client';

import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowLeft, Play, Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h1>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Discover Audio Tours</h3>
                <p className="text-gray-600">
                  Browse through Voxtrav collection of audio tours from amazing destinations around the world. 
                  Use the search bar to find specific places, cities, or countries.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Choose Your Tour</h3>
                <p className="text-gray-600">
                  Click on any tour card to view detailed Voxtrav information about the location. 
                  Each tour includes high-quality images and immersive audio content.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Listen & Explore</h3>
                <p className="text-gray-600">
                  Use our Spotify-like audio player to listen to pre recorded guided tours. Choose between 
                  1-minute quick overviews or 10-minute detailed experiences.

                  Avoid the hassle of booking a tour guide. All information is in your device on click of a button.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">High-Quality Audio</h4>
                <p className="text-gray-600 text-sm">Crystal clear audio guides with professional narration</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Multiple Durations</h4>
                <p className="text-gray-600 text-sm">Choose between quick overviews or detailed experiences</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Beautiful Images</h4>
                <p className="text-gray-600 text-sm">High-resolution photos of each location</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Easy Navigation</h4>
                <p className="text-gray-600 text-sm">Intuitive interface for seamless browsing</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 