-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'monthly', 'premium')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  monthly_audio_count INTEGER DEFAULT 0,
  yearly_audio_count INTEGER DEFAULT 0,
  last_audio_reset_date DATE DEFAULT CURRENT_DATE,
  last_yearly_reset_date DATE DEFAULT CURRENT_DATE,
  referred_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  audio_speed DECIMAL(3,2) DEFAULT 1.0,
  auto_play BOOLEAN DEFAULT false,
  background_play BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tour_id)
);

-- Create tour_history table
CREATE TABLE IF NOT EXISTS tour_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id TEXT NOT NULL,
  audio_duration INTEGER, -- in seconds
  completed BOOLEAN DEFAULT false,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create self_notes table
CREATE TABLE IF NOT EXISTS self_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  category TEXT CHECK (category IN ('audio_quality', 'content', 'navigation', 'technical', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reward_type TEXT CHECK (reward_type IN ('free_month', 'cash')),
  reward_amount DECIMAL(10,2),
  reward_paid BOOLEAN DEFAULT false,
  reward_paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- Create referral_earnings table
CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('free_month', 'cash')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_details JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create device_tracking table for non-logged users
CREATE TABLE IF NOT EXISTS device_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_fingerprint TEXT NOT NULL,
  ip_address INET,
  audio_tours_accessed INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(device_fingerprint)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_history_user_id ON tour_history(user_id);
CREATE INDEX IF NOT EXISTS idx_self_notes_user_id ON self_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_user_id ON referral_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tracking_fingerprint ON device_tracking(device_fingerprint);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_self_notes_updated_at BEFORE UPDATE ON self_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, referred_by)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    (NEW.raw_user_meta_data->>'referred_by')::UUID
  );
  
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to reset monthly audio count
CREATE OR REPLACE FUNCTION reset_monthly_audio_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_audio_reset_date < CURRENT_DATE - INTERVAL '1 month' THEN
    NEW.monthly_audio_count = 0;
    NEW.last_audio_reset_date = CURRENT_DATE;
  END IF;
  
  IF NEW.last_yearly_reset_date < CURRENT_DATE - INTERVAL '1 year' THEN
    NEW.yearly_audio_count = 0;
    NEW.last_yearly_reset_date = CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for audio count reset
CREATE TRIGGER reset_audio_counts
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION reset_monthly_audio_count();

-- Create function to handle referral rewards
CREATE OR REPLACE FUNCTION handle_referral_reward()
RETURNS TRIGGER AS $$
DECLARE
  referrer_plan TEXT;
  referrer_quota_hit BOOLEAN;
  reward_amount DECIMAL(10,2);
BEGIN
  -- Only process when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Get referrer's plan
    SELECT subscription_plan INTO referrer_plan
    FROM profiles
    WHERE id = NEW.referrer_id;
    
    -- Check if referrer has hit their quota
    IF referrer_plan = 'monthly' THEN
      SELECT COUNT(*) >= 3 INTO referrer_quota_hit
      FROM referrals
      WHERE referrer_id = NEW.referrer_id AND status = 'completed';
    ELSIF referrer_plan = 'premium' THEN
      SELECT COUNT(*) >= 6 INTO referrer_quota_hit
      FROM referrals
      WHERE referrer_id = NEW.referrer_id AND status = 'completed';
    ELSE
      referrer_quota_hit := false;
    END IF;
    
    -- Determine reward
    IF referrer_quota_hit THEN
      -- Cash reward (40% of subscription)
      IF referrer_plan = 'monthly' THEN
        reward_amount := 1.00; -- 40% of $2.50
      ELSE
        reward_amount := 100.00; -- 40% of $250
      END IF;
      
      NEW.reward_type := 'cash';
      NEW.reward_amount := reward_amount;
    ELSE
      -- Free month reward
      IF referrer_plan = 'monthly' THEN
        NEW.reward_type := 'free_month';
        NEW.reward_amount := 1;
      ELSE
        NEW.reward_type := 'free_month';
        NEW.reward_amount := 3;
      END IF;
    END IF;
    
    -- Create earnings record
    INSERT INTO referral_earnings (user_id, referral_id, amount, type)
    VALUES (NEW.referrer_id, NEW.id, NEW.reward_amount, NEW.reward_type);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral rewards
CREATE TRIGGER handle_referral_rewards
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION handle_referral_reward();

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Tour history policies
CREATE POLICY "Users can view own tour history" ON tour_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tour history" ON tour_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Self notes policies
CREATE POLICY "Users can view own notes" ON self_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON self_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON self_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON self_notes FOR DELETE USING (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view own feedback" ON feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feedback" ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can insert referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referred_id);
CREATE POLICY "Users can update own referrals" ON referrals FOR UPDATE USING (auth.uid() = referrer_id);

-- Referral earnings policies
CREATE POLICY "Users can view own earnings" ON referral_earnings FOR SELECT USING (auth.uid() = user_id);

-- Withdrawal requests policies
CREATE POLICY "Users can view own withdrawal requests" ON withdrawal_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own withdrawal requests" ON withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Device tracking policies (no auth required for basic tracking)
CREATE POLICY "Allow device tracking" ON device_tracking FOR ALL USING (true);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tracking ENABLE ROW LEVEL SECURITY; 