-- Create tour_history table
CREATE TABLE IF NOT EXISTS tour_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tour_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_listened INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tour_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own tour history" ON tour_history;
DROP POLICY IF EXISTS "Users can insert their own tour history" ON tour_history;
DROP POLICY IF EXISTS "Users can update their own tour history" ON tour_history;
DROP POLICY IF EXISTS "Users can delete their own tour history" ON tour_history;

-- Create policies for tour_history
CREATE POLICY "Users can view their own tour history" ON tour_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tour history" ON tour_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tour history" ON tour_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tour history" ON tour_history
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tour_history_user_id ON tour_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_history_completed_at ON tour_history(completed_at DESC);

-- Create user_notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for user_notes
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON user_notes;

-- Create policies for user_notes
CREATE POLICY "Users can view their own notes" ON user_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON user_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON user_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON user_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for user_notes
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_created_at ON user_notes(created_at DESC);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Can be UUID or 'anonymous'
  user_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for user_feedback
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own feedback" ON user_feedback;
DROP POLICY IF EXISTS "Users can insert feedback" ON user_feedback;
DROP POLICY IF EXISTS "Users can update their own feedback" ON user_feedback;
DROP POLICY IF EXISTS "Users can delete their own feedback" ON user_feedback;

-- Create policies for user_feedback (allow anonymous feedback)
CREATE POLICY "Users can view their own feedback" ON user_feedback
  FOR SELECT USING (
    auth.uid()::text = user_id OR 
    (auth.uid() IS NULL AND user_id = 'anonymous')
  );

CREATE POLICY "Users can insert feedback" ON user_feedback
  FOR INSERT WITH CHECK (
    auth.uid()::text = user_id OR 
    user_id = 'anonymous'
  );

CREATE POLICY "Users can update their own feedback" ON user_feedback
  FOR UPDATE USING (
    auth.uid()::text = user_id OR 
    (auth.uid() IS NULL AND user_id = 'anonymous')
  );

CREATE POLICY "Users can delete their own feedback" ON user_feedback
  FOR DELETE USING (
    auth.uid()::text = user_id OR 
    (auth.uid() IS NULL AND user_id = 'anonymous')
  );

-- Create index for user_feedback
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_feedback_category ON user_feedback(category); 