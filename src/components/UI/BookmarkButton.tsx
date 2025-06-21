'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { addBookmark, removeBookmark, isBookmarked } from '@/lib/userService'

interface BookmarkButtonProps {
  tourId: string
  userId: string
  className?: string
}

export default function BookmarkButton({ tourId, userId, className = '' }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      checkBookmarkStatus()
    }
  }, [userId, tourId])

  const checkBookmarkStatus = async () => {
    try {
      const bookmarkedStatus = await isBookmarked(userId, tourId)
      setBookmarked(bookmarkedStatus)
    } catch (error) {
      console.error('Error checking bookmark status:', error)
    }
  }

  const handleToggleBookmark = async () => {
    if (!userId || isLoading) return

    setIsLoading(true)
    try {
      if (bookmarked) {
        await removeBookmark(userId, tourId)
        setBookmarked(false)
      } else {
        await addBookmark(userId, tourId)
        setBookmarked(true)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 ${
        bookmarked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
    >
      <Heart
        className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`}
      />
    </button>
  )
} 