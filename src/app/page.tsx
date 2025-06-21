'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import SearchBar from '@/components/UI/SearchBar';
import TourCard from '@/components/Home/TourCard';
import { Tour } from '@/types/tour';
import toursData from '@/data/tours.json';

export default function HomePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tours from static JSON file
    setTours(toursData);
    setFilteredTours(toursData.slice(0, 8));
    setIsLoading(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredTours(tours.slice(0, 8));
      return;
    }

    const filtered = tours.filter(tour => 
      tour.place.toLowerCase().includes(query.toLowerCase()) ||
      tour.city.toLowerCase().includes(query.toLowerCase()) ||
      tour.country.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredTours(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tours...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Places with
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Audio Tours</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in the stories and history of incredible destinations around the world
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Found {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* No Results */}
        {filteredTours.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </div>
        )}

        {/* Load More Button (when searching) */}
        {searchQuery && filteredTours.length > 0 && filteredTours.length < tours.length && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setFilteredTours(tours.filter(tour => 
                tour.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.country.toLowerCase().includes(searchQuery.toLowerCase())
              ))}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Show All Results ({tours.filter(tour => 
                tour.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.country.toLowerCase().includes(searchQuery.toLowerCase())
              ).length})
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 