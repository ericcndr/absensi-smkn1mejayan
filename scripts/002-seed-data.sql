-- Insert sample office location
INSERT INTO offices (name, address, latitude, longitude, radius_meters)
VALUES 
  ('Kantor Pusat Jakarta', 'Jl. Sudirman No. 123, Jakarta Selatan', -6.2088, 106.8456, 150),
  ('Kantor Cabang Bandung', 'Jl. Braga No. 45, Bandung', -6.9175, 107.6191, 100)
ON CONFLICT DO NOTHING;

-- Insert updated office location to Randualas, Madiun Regency, East Java
INSERT INTO offices (name, address, latitude, longitude, radius_meters)
VALUES 
  ('Kantor Randualas', 'Randualas, Kecamatan Mejayan, Kabupaten Madiun, Jawa Timur', -7.6298, 111.5239, 150),
  ('Kantor Cabang Madiun Kota', 'Jl. Pahlawan No. 45, Kota Madiun', -7.6298, 111.5239, 100)
ON CONFLICT DO NOTHING;

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role, employee_id, department)
VALUES 
  ('admin@company.com', '$2a$10$YourHashedPasswordHere', 'Admin System', 'admin', 'ADM001', 'IT')
ON CONFLICT (email) DO NOTHING;

-- Insert sample employees (password: employee123)
INSERT INTO users (email, password_hash, full_name, role, employee_id, department)
VALUES 
  ('budi@company.com', '$2a$10$YourHashedPasswordHere', 'Budi Santoso', 'employee', 'EMP001', 'Engineering'),
  ('siti@company.com', '$2a$10$YourHashedPasswordHere', 'Siti Nurhaliza', 'employee', 'EMP002', 'Marketing'),
  ('agus@company.com', '$2a$10$YourHashedPasswordHere', 'Agus Wijaya', 'employee', 'EMP003', 'Finance')
ON CONFLICT (email) DO NOTHING;
