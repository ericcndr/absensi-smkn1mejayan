-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('employee', 'admin')),
  employee_id TEXT UNIQUE,
  department TEXT,
  face_encoding TEXT, -- Store face recognition data
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create offices table for GPS locations
CREATE TABLE IF NOT EXISTS offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100, -- Allowed GPS radius
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance records table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  office_id UUID REFERENCES offices(id),
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out_time TIMESTAMP WITH TIME ZONE,
  check_in_latitude DECIMAL(10, 8) NOT NULL,
  check_in_longitude DECIMAL(11, 8) NOT NULL,
  check_out_latitude DECIMAL(10, 8),
  check_out_longitude DECIMAL(11, 8),
  check_in_photo_url TEXT, -- Selfie photo URL
  check_out_photo_url TEXT,
  face_match_score DECIMAL(5, 2), -- AI confidence score (0-100)
  is_spoofing_detected BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'warning', 'info')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in_time ON attendance(check_in_time);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
