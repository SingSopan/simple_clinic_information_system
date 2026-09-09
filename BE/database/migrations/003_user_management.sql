ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE registrations r SET doctor_id = u.id
FROM users u
WHERE r.doctor_id IS NULL AND r.doctor_name = u.name AND u.role = 'Dokter';

INSERT INTO users (name, email, password_hash, role)
VALUES ('Super Admin', 'superadmin@klinik.test', '$2b$10$Q01nbYMRd5IbRAxoahUp7uY40i/vG4nLloho3Ot6PA./FirlyA2vG', 'Superadmin')
ON CONFLICT (email) DO UPDATE SET role = 'Superadmin', is_active = TRUE, updated_at = NOW();
