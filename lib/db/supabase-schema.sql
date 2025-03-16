-- Create wordbooks table
CREATE TABLE wordbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create words table
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wordbook_id UUID REFERENCES wordbooks(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  part_of_speech TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE wordbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Wordbooks policies
CREATE POLICY "Users can view their own wordbooks" 
  ON wordbooks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wordbooks" 
  ON wordbooks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wordbooks" 
  ON wordbooks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wordbooks" 
  ON wordbooks FOR DELETE 
  USING (auth.uid() = user_id);

-- Words policies
CREATE POLICY "Users can view words in their wordbooks" 
  ON words FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM wordbooks 
    WHERE wordbooks.id = words.wordbook_id 
    AND wordbooks.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert words in their wordbooks" 
  ON words FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM wordbooks 
    WHERE wordbooks.id = words.wordbook_id 
    AND wordbooks.user_id = auth.uid()
  ));

CREATE POLICY "Users can update words in their wordbooks" 
  ON words FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM wordbooks 
    WHERE wordbooks.id = words.wordbook_id 
    AND wordbooks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete words in their wordbooks" 
  ON words FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM wordbooks 
    WHERE wordbooks.id = words.wordbook_id 
    AND wordbooks.user_id = auth.uid()
  ));

