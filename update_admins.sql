-- Update Campus Head with assigned campus
UPDATE Admin SET assignedCampus = 'ADYAR' WHERE adminMobile = '9200000001';

-- Create Super Admin
INSERT INTO Admin (adminName, adminMobile, role, assignedCampus, createdAt) 
VALUES ('Super Admin', '9100000000', 'Super Admin', NULL, datetime('now'));
