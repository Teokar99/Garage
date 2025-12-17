/*
  # Add Service Records Table

  1. New Tables
    - `service_records`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, foreign key to vehicles)
      - `mechanic_id` (uuid, foreign key to profiles)
      - `date` (timestamp with time zone)
      - `description` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `service_records` table
    - Add policy for authenticated users to read service records
    - Add policy for authenticated users to insert service records
    - Add policy for mechanics to update their own service records
*/

CREATE TABLE IF NOT EXISTS service_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  mechanic_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  date timestamp with time zone DEFAULT now(),
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read service records"
  ON service_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert service records"
  ON service_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Mechanics can update their own service records"
  ON service_records
  FOR UPDATE
  TO authenticated
  USING (mechanic_id = auth.uid())
  WITH CHECK (mechanic_id = auth.uid());

CREATE POLICY "Admins can manage all service records"
  ON service_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );