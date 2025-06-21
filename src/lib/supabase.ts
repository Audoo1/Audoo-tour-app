import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  tour_id: string
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  audio_speed: number
  volume: number
  created_at: string
  updated_at: string
}