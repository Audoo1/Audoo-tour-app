'use client';

import Header from '@/components/Layout/Header';
import { ArrowLeft, User, Heart, Clock, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h1>
            <p className="text-gray-600">Welcome to your audio tour dashboard</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary-50 rounded-lg p-4 text-center">
              <Heart className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">0</h3>
              <p className="text-gray-600 text-sm">Favorite Tours</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">0</h3>
              <p className="text-gray-600 text-sm">Tours Completed</p>
            </div>
            <div className="bg-accent-50 rounded-lg p-4 text-center">
              <Settings className="h-8 w-8 text-accent-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">0</h3>
              <p className="text-gray-600 text-sm">Hours Listened</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
              <p className="text-gray-600">Start exploring tours to see your activity here</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Explore Tours
              </button>
              <button
                onClick={() => router.push('/how-it-works')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 