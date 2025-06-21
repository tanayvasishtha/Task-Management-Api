-- Keploy Fellowship Task Management API Database Setup
-- Run this script to create the database and table

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS keploy_fellowship;

-- Use the database
USE keploy_fellowship;

-- Create tasks table with all required fields
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Insert some sample data for testing
INSERT INTO tasks (title, description, status) VALUES
('Complete Keploy Fellowship', 'Finish Session 2 assignment with Task Management API', 'in-progress'),
('Learn Node.js', 'Master Express.js and REST API development', 'completed'),
('Database Design', 'Design and implement MySQL schema for tasks', 'completed'),
('API Testing', 'Test all CRUD endpoints with curl commands', 'pending'),
('Frontend Integration', 'Create HTML interface for API interaction', 'pending');

-- Show the created table structure
DESCRIBE tasks;

-- Show sample data
SELECT * FROM tasks; 