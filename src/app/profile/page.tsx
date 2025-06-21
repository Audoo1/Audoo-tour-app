'use client';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Settings, Bookmark, Headphones, LogOut, Edit, Camera, MessageSquare, FileText, Save, X } from 'lucide-react'
import SignInForm from '@/components/Auth/SignInForm'
import SignUpForm from '@/components/Auth/SignUpForm'
import SelfNotes from '@/components/Profile/SelfNotes'
import FeedbackForm from '@/components/Profile/FeedbackForm'
import { getUserPreferences, updateUserPreferences, getBookmarks, getTourHistory } from '@/lib/userService'
import { UserPreferences, Bookmark as BookmarkType, TourHistory } from '@/lib/userService'
import tours from '@/data/tours.json'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [tourHistory, setTourHistory] = useState<TourHistory[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Load preferences
      const userPrefs = await getUserPreferences(user.id)
      setPreferences(userPrefs || {
        user_id: user.id,
        audio_speed: 1,
        volume: 0.8
      })

      // Load bookmarks
      const userBookmarks = await getBookmarks(user.id)
      setBookmarks(userBookmarks)

      // Load tour history
      const userHistory = await getTourHistory(user.id)
      setTourHistory(userHistory)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleAuthSuccess = () => {
    window.location.reload()
  }

  const handlePreferenceChange = async (key: keyof UserPreferences, value: any) => {
    if (!preferences) return

    const updatedPrefs = { ...preferences, [key]: value }
    setPreferences(updatedPrefs)

    // Save to database
    const success = await updateUserPreferences(updatedPrefs)
    if (!success) {
      console.error('Failed to save preferences')
    }
  }

  const handleSaveProfile = async () => {
    if (!user || !editName.trim()) return

    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: editName }
      })

      if (error) throw error

      setUser({ ...user, user_metadata: { ...user.user_metadata, name: editName } })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getBookmarkedTours = () => {
    return tours.filter(tour => bookmarks.some(bookmark => bookmark.tour_id === tour.id))
  }

  const getTourById = (tourId: string) => {
    return tours.find(tour => tour.id === tourId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {showSignUp ? (
          <SignUpForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setShowSignUp(false)}
          />
        ) : (
          <SignInForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setShowSignUp(true)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-2xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1"
                      placeholder="Enter name"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.user_metadata?.name || 'User'}
                    </h1>
                    <button
                      onClick={() => {
                        setEditName(user.user_metadata?.name || '')
                        setIsEditing(true)
                      }}
                      className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bookmarks</p>
                <p className="text-2xl font-bold text-gray-900">{bookmarks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tours Completed</p>
                <p className="text-2xl font-bold text-gray-900">{tourHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Audio Speed</p>
                <p className="text-2xl font-bold text-gray-900">{preferences?.audio_speed || 1}x</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cities Visited</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(tourHistory.map(h => getTourById(h.tour_id)?.city).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
                { id: 'history', label: 'History', icon: Headphones },
                { id: 'notes', label: 'Notes', icon: FileText },
                { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  {tourHistory.length > 0 ? (
                    <div className="space-y-3">
                      {tourHistory.slice(0, 5).map((history) => {
                        const tour = getTourById(history.tour_id)
                        return tour ? (
                          <div key={history.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Headphones className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{tour.place}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(history.completed_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ) : null
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-600">No recent activity</p>
                  )}
                </div>
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Bookmarks</h3>
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getBookmarkedTours().map((tour) => (
                      <div key={tour.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{tour.place}</h4>
                        <p className="text-sm text-gray-600">{tour.city}, {tour.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No bookmarks yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start exploring tours and bookmark your favorites
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour History</h3>
                {tourHistory.length > 0 ? (
                  <div className="space-y-3">
                    {tourHistory.map((history) => {
                      const tour = getTourById(history.tour_id)
                      return tour ? (
                        <div key={history.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Headphones className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{tour.place}</p>
                              <p className="text-sm text-gray-600">{tour.city}, {tour.country}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(history.completed_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round(history.duration_listened / 60)} min listened
                            </p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tour history yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Complete some tours to see your history here
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div>
                <SelfNotes />
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div>
                <FeedbackForm />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Audio Speed
                      </label>
                      <select
                        value={preferences?.audio_speed || 1}
                        onChange={(e) => handlePreferenceChange('audio_speed', parseFloat(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={0.5}>Slow (0.5x)</option>
                        <option value={0.75}>Slow (0.75x)</option>
                        <option value={1}>Normal (1x)</option>
                        <option value={1.25}>Fast (1.25x)</option>
                        <option value={1.5}>Fast (1.5x)</option>
                        <option value={2}>Very Fast (2x)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Volume
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={preferences?.volume || 0.8}
                        onChange={(e) => handlePreferenceChange('volume', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>{Math.round((preferences?.volume || 0.8) * 100)}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </button>
                    <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-600">Permanently delete your account and data</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 