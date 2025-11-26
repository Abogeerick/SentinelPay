-- Migration: Add name and avatar columns to users table
-- Run this if you already have the users table created

ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);

