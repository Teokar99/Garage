/*
  # Fix RLS policies for service_records table

  1. Security Issues Fixed
    - Remove overly broad `ALL` policy for admins that can cause policy conflicts
    - Fix insecure `INSERT` policy that allows users to impersonate other mechanics
    - Replace with granular, secure policies for each operation

  2. New Admin Policies
    - Separate `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies for admins
    - Each policy explicitly checks for admin role

  3. Secure User Policies
    - `INSERT` policy ensures users can only create records with their own mechanic_id
    - `UPDATE` policy allows mechanics to update only their own records
    - `SELECT` policy remains unchanged (all authenticated users can read)

  4. Data Integrity
    - Prevents mechanics from creating service records under other mechanics' names
    - Maintains clear separation between admin and mechanic permissions
*/

-- Drop the problematic existing policies
DROP POLICY IF EXISTS "Admins can manage all service records" ON service_records;
DROP POLICY IF EXISTS "Authenticated users can insert service records" ON service_records;

-- Create separate, granular admin policies
CREATE POLICY "Admins can select all service records"
  ON service_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert service records"
  ON service_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all service records"
  ON service_records
  FOR UPDATE
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

CREATE POLICY "Admins can delete service records"
  ON service_records
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create secure user policies
CREATE POLICY "Users can insert their own service records"
  ON service_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User can only insert records with their own mechanic_id OR user is admin
    mechanic_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Keep the existing SELECT and UPDATE policies for mechanics as they are secure
-- (These should already exist and work correctly)

-- Ensure the existing mechanic UPDATE policy is properly defined
DO $$
BEGIN
  -- Check if the mechanic update policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'service_records' 
    AND policyname = 'Mechanics can update their own service records'
  ) THEN
    CREATE POLICY "Mechanics can update their own service records"
      ON service_records
      FOR UPDATE
      TO authenticated
      USING (mechanic_id = auth.uid())
      WITH CHECK (mechanic_id = auth.uid());
  END IF;
END $$;