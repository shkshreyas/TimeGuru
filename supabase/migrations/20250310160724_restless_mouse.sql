/*
  # Create Tasks Table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `category` (text)
      - `start_time` (timestamp with timezone)
      - `end_time` (timestamp with timezone, nullable)
      - `duration` (integer, in seconds)
      - `is_productive` (boolean, default true)
      - `notes` (text, nullable)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on tasks table
    - Add policy for users to manage their own tasks
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  category text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration integer,
  is_productive boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);