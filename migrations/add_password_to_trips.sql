-- Migration: Add password column to trips table
-- Description: Adds an optional password field to trips table for private trip access control
-- Date: 2026-01-27

-- Add password column to trips table (nullable, optional)
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Add comment to column
COMMENT ON COLUMN trips.password IS 'Optional password for joining private trips. NULL means trip is public.';
