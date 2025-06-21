
-- Complete database setup script
-- Run this script to create database, tables, and populate with initial data

-- Create database and table
SOURCE database/create_tables.sql;

-- Insert initial data
SOURCE database/insert_data.sql;

-- Verify data insertion
SELECT COUNT(*) as total_records FROM models;
SELECT DISTINCT model_type, COUNT(*) as count_per_type FROM models GROUP BY model_type;
SELECT DISTINCT status, COUNT(*) as count_per_status FROM models GROUP BY status;
