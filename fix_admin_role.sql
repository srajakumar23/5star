-- Update the old "Super Admin" named admin to "Admission Admin" role
-- This is the admin with mobile 9999999999
UPDATE Admin 
SET role = 'Admission Admin' 
WHERE adminMobile = '9999999999';
