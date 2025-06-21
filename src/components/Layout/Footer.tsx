'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
            <span className="font-medium text-gray-900">Voxtrav - Audio Tour Guide</span>
            <span className="hidden sm:inline">|</span>
            <Link 
              href="https://voxtrav.info" 
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voxtrav.info
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link 
              href="https://www.instagram.com/voxtrav.info" 
              className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat at Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 