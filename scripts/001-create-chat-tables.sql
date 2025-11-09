-- Create proximity_chat_messages table
CREATE TABLE IF NOT EXISTS proximity_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_wallet TEXT NOT NULL,
  sender_username TEXT NOT NULL,
  message TEXT NOT NULL,
  district TEXT,
  position_x REAL,
  position_z REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create global_chat_messages table
CREATE TABLE IF NOT EXISTS global_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_wallet TEXT NOT NULL,
  sender_username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE proximity_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for proximity_chat_messages
CREATE POLICY "Anyone can read proximity chat" ON proximity_chat_messages FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can send proximity messages" ON proximity_chat_messages FOR INSERT TO authenticated WITH CHECK (true);

-- Policies for global_chat_messages
CREATE POLICY "Anyone can read global chat" ON global_chat_messages FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can send global messages" ON global_chat_messages FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_proximity_chat_created_at ON proximity_chat_messages(created_at DESC);
CREATE INDEX idx_proximity_chat_district ON proximity_chat_messages(district);
CREATE INDEX idx_global_chat_created_at ON global_chat_messages(created_at DESC);
