
-- Add Model Validator Name column to existing models table
USE modelregistry;

ALTER TABLE models 
ADD COLUMN model_validator_name VARCHAR(255) NULL 
AFTER model_sponsor;

-- Create index for better performance on validator name searches
CREATE INDEX idx_model_validator_name ON models(model_validator_name);

-- Update existing records with sample validator names
UPDATE models SET model_validator_name = 'Jane Smith' WHERE model_id = 1;
UPDATE models SET model_validator_name = 'Robert Johnson' WHERE model_id = 2;
UPDATE models SET model_validator_name = 'Emily Davis' WHERE model_id = 3;
UPDATE models SET model_validator_name = 'Michael Wilson' WHERE model_id = 4;
UPDATE models SET model_validator_name = 'Sarah Brown' WHERE model_id = 5;
UPDATE models SET model_validator_name = 'David Chen' WHERE model_id = 6;
UPDATE models SET model_validator_name = 'Lisa Taylor' WHERE model_id = 7;
UPDATE models SET model_validator_name = 'Jennifer Lee' WHERE model_id = 8;
UPDATE models SET model_validator_name = 'Thomas Anderson' WHERE model_id = 9;
UPDATE models SET model_validator_name = 'Maria Garcia' WHERE model_id = 10;
