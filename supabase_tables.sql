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