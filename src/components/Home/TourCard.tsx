'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Play } from 'lucide-react';
import { Tour } from '@/types/tour';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tour/${tour.id}`}>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {tour.image ? (
            <Image
              src={tour.image}
              alt={tour.place}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          )}
          
          {/* Audio indicator */}
          {(tour.audio1min || tour.audio10min) && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-2">
              <Play className="h-4 w-4 text-white" fill="white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors duration-200">
            {tour.place}
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{tour.city}, {tour.country}</span>
          </div>

          {/* Audio availability */}
          <div className="flex items-center space-x-2">
            {tour.audio1min && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                1 min
              </span>
            )}
            {tour.audio10min && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                10 min
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 