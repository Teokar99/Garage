/*
  # Remove Jobs and Reports functionality

  This migration removes all job-related tables and functionality from the database:

  1. Tables to be dropped:
     - `job_parts` (junction table for jobs and parts)
     - `jobs` (main jobs table)

  2. Functions to be dropped:
     - `update_job_total_cost()` (function for calculating job costs)
     - `update_part_stock()` (function for updating part stock from job parts)

  3. Updates:
     - Update `stock_movements` table to remove job-related reference types
     - Clean up any remaining triggers or constraints

  Note: This will permanently delete all job data. Make sure to backup if needed.
*/

-- Drop triggers first (they depend on functions)
DROP TRIGGER IF EXISTS trigger_update_job_cost_on_job_update ON jobs;
DROP TRIGGER IF EXISTS trigger_update_job_cost ON job_parts;
DROP TRIGGER IF EXISTS trigger_update_part_stock ON job_parts;

-- Drop tables (job_parts first due to foreign key dependency)
DROP TABLE IF EXISTS job_parts CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_job_total_cost() CASCADE;
DROP FUNCTION IF EXISTS update_part_stock() CASCADE;

-- Update stock_movements table to remove job reference type
DO $$
BEGIN
  -- Remove the constraint that includes 'job' as a valid reference_type
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'stock_movements_reference_type_check' 
    AND table_name = 'stock_movements'
  ) THEN
    ALTER TABLE stock_movements DROP CONSTRAINT stock_movements_reference_type_check;
    
    -- Add the updated constraint without 'job'
    ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_reference_type_check 
    CHECK ((reference_type = ANY (ARRAY['purchase'::text, 'adjustment'::text, 'return'::text])));
  END IF;
END $$;

-- Clean up any stock movements that reference jobs
DELETE FROM stock_movements WHERE reference_type = 'job';