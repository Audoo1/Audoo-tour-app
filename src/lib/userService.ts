import { supabase } from './supabase'

export interface UserPreferences {
  id?: string
  user_id: string
  audio_speed: number
  volume: number
  created_at?: string
  updated_at?: string
}

export interface Bookmark {
  id?: string
  user_id: string
  tour_id: string
  created_at?: string
}

export interface TourHistory {
  id?: string
  user_id: string
  tour_id: string
  completed_at: string
  duration_listened: number
}

// User Preferences
export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return null
  }
}

export const updateUserPreferences = async (preferences: UserPreferences): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        ...preferences,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return false
  }
}

// Bookmarks
export const getBookmarks = async (userId: string): Promise<Bookmark[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return []
  }
}

export const addBookmark = async (userId: string, tourId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        tour_id: tourId
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error adding bookmark:', error)
    return false
  }
}

export const removeBookmark = async (userId: string, tourId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('tour_id', tourId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return false
  }
}

export const isBookmarked = async (userId: string, tourId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('tour_id', tourId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  } catch (error) {
    console.error('Error checking bookmark status:', error)
    return false
  }
}

// Tour History
export const addTourHistory = async (userId: string, tourId: string, durationListened: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tour_history')
      .insert({
        user_id: userId,
        tour_id: tourId,
        completed_at: new Date().toISOString(),
        duration_listened: durationListened
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error adding tour history:', error)
    return false
  }
}

export const getTourHistory = async (userId: string): Promise<TourHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('tour_history')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching tour history:', error)
    return []
  }
} 