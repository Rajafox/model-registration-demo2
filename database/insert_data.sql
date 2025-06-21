
-- Insert initial dummy data
USE modelregistry;

INSERT INTO models (model_name, model_version, model_sponsor, business_line, model_type, risk_rating, status, updated_by, updated_on) VALUES
('Credit Risk Assessment Model', 'v2.1', 'John Smith', 'Retail Banking', 'Credit Risk', 'High', 'Production', 'Admin', NOW()),
('Market Risk VaR Model', 'v1.5', 'Sarah Johnson', 'Investment Banking', 'Market Risk', 'Medium', 'Production', 'Admin', NOW()),
('AML Transaction Monitoring', 'v3.0', 'Mike Davis', 'Risk Management', 'AML', 'High', 'Validated', 'Admin', NOW()),
('Operational Risk Calculator', 'v1.2', 'Lisa Wilson', 'Risk Management', 'Operational Risk', 'Low', 'In Development', 'Admin', NOW()),
('Portfolio Valuation Model', 'v2.0', 'Robert Brown', 'Investment Banking', 'Valuation', 'Medium', 'Production', 'Admin', NOW()),
('Capital Adequacy Model', 'v1.8', 'Emily Chen', 'Risk Management', 'Capital Calculation', 'High', 'Validated', 'Admin', NOW()),
('Retail Loan Pricing Model', 'v1.0', 'David Taylor', 'Retail Banking', 'Credit Risk', 'Medium', 'Draft', 'Admin', NOW()),
('Stress Testing Model', 'v2.3', 'Jennifer Lee', 'Wholesale Lending', 'Market Risk', 'High', 'Production', 'Admin', NOW()),
('Customer Segmentation Model', 'v1.1', 'Thomas Anderson', 'Retail Banking', 'Credit Risk', 'Low', 'Retired', 'Admin', NOW()),
('Fraud Detection Model', 'v4.0', 'Maria Garcia', 'Risk Management', 'AML', 'High', 'In Development', 'Admin', NOW());
