-- ResQ Pro Database Schema
-- This file contains all the necessary tables for the ResQ Pro emergency preparedness app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game state table
CREATE TABLE public.user_game_state (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  journey_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Daily completions table
CREATE TABLE public.daily_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quest_id TEXT NOT NULL,
  completion_date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id, completion_date)
);

-- User badges table
CREATE TABLE public.user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Quests table
CREATE TABLE public.quests (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('scenario', 'checklist')),
  title TEXT NOT NULL,
  description TEXT,
  xp_value INTEGER NOT NULL,
  options JSONB, -- For scenario quests
  steps JSONB, -- For checklist quests
  category TEXT,
  difficulty TEXT DEFAULT 'beginner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table
CREATE TABLE public.badges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_path TEXT NOT NULL,
  requirement INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('xp', 'streak', 'quests')),
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones table
CREATE TABLE public.milestones (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon_path TEXT NOT NULL,
  description TEXT,
  requirement_xp INTEGER,
  requirement_quests INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User milestones table
CREATE TABLE public.user_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  milestone_id TEXT REFERENCES public.milestones(id) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

-- Guides table
CREATE TABLE public.guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  filename TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking table
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('quests_completed', 'total_xp', 'streak', 'badges_earned', 'milestones_completed')),
  metric_value INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, metric_type, recorded_at::DATE)
);

-- Emergency alerts table (for future use)
CREATE TABLE public.emergency_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Safety scan results table
CREATE TABLE public.safety_scan_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT, -- URL to the scanned image (stored in Supabase Storage)
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  summary TEXT NOT NULL,
  suggestions JSONB NOT NULL, -- Array of suggestion strings
  analysis_data JSONB, -- Full analysis data for future use
  location_name TEXT, -- Optional: user can name the scanned location
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_game_state_user_id ON public.user_game_state(user_id);
CREATE INDEX idx_daily_completions_user_id ON public.daily_completions(user_id);
CREATE INDEX idx_daily_completions_date ON public.daily_completions(completion_date);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_user_milestones_user_id ON public.user_milestones(user_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_metric_type ON public.user_progress(metric_type);
CREATE INDEX idx_emergency_alerts_user_id ON public.emergency_alerts(user_id);
CREATE INDEX idx_emergency_alerts_created_at ON public.emergency_alerts(created_at);
CREATE INDEX idx_safety_scan_results_user_id ON public.safety_scan_results(user_id);
CREATE INDEX idx_safety_scan_results_created_at ON public.safety_scan_results(created_at);
CREATE INDEX idx_safety_scan_results_risk_level ON public.safety_scan_results(risk_level);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_scan_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_game_state
CREATE POLICY "Users can view own game state" ON public.user_game_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own game state" ON public.user_game_state
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game state" ON public.user_game_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_completions
CREATE POLICY "Users can view own completions" ON public.daily_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON public.daily_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_badges
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_milestones
CREATE POLICY "Users can view own milestones" ON public.user_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones" ON public.user_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for emergency_alerts
CREATE POLICY "Users can view own alerts" ON public.emergency_alerts
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own alerts" ON public.emergency_alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for safety_scan_results
CREATE POLICY "Users can view own safety scans" ON public.safety_scan_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own safety scans" ON public.safety_scan_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own safety scans" ON public.safety_scan_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own safety scans" ON public.safety_scan_results
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for quests, badges, milestones, and guides
CREATE POLICY "Anyone can view active quests" ON public.quests
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view active milestones" ON public.milestones
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active guides" ON public.guides
  FOR SELECT USING (is_active = true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_game_state_updated_at BEFORE UPDATE ON public.user_game_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON public.quests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_scan_results_updated_at BEFORE UPDATE ON public.safety_scan_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  
  INSERT INTO public.user_game_state (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile and game state
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
