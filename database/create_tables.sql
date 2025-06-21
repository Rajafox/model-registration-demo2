
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS modelregistry;
USE modelregistry;

-- Create models table
CREATE TABLE IF NOT EXISTS models (
    model_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_sponsor VARCHAR(255) NOT NULL,
    business_line VARCHAR(255) NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    risk_rating VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    updated_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_model_name ON models(model_name);
CREATE INDEX idx_model_type ON models(model_type);
CREATE INDEX idx_status ON models(status);
CREATE INDEX idx_business_line ON models(business_line);
