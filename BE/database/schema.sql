CREATE TYPE user_role AS ENUM ('Superadmin', 'Administrator', 'Dokter', 'Petugas Pendaftaran');
CREATE TYPE visit_status AS ENUM ('Menunggu', 'Check In', 'Pemeriksaan', 'Selesai');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, role user_role NOT NULL, is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE patients (
  id BIGSERIAL PRIMARY KEY, medical_record_number VARCHAR(30) NOT NULL UNIQUE, nik VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL, gender VARCHAR(20) NOT NULL, birth_date DATE NOT NULL, phone VARCHAR(30) NOT NULL,
  address TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY, patient_id BIGINT NOT NULL REFERENCES patients(id), doctor_id BIGINT REFERENCES users(id),
  doctor_name VARCHAR(120), clinic VARCHAR(100) NOT NULL, visit_date DATE NOT NULL, payment_type VARCHAR(50) NOT NULL,
  initial_complaint TEXT NOT NULL, status visit_status NOT NULL DEFAULT 'Menunggu', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE queues (
  id BIGSERIAL PRIMARY KEY, registration_id BIGINT NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
  queue_number VARCHAR(10) NOT NULL, queue_date DATE NOT NULL, status visit_status NOT NULL DEFAULT 'Menunggu',
  called_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(queue_date, queue_number)
);
CREATE TABLE medical_records (
  id BIGSERIAL PRIMARY KEY, registration_id BIGINT NOT NULL UNIQUE REFERENCES registrations(id), patient_id BIGINT NOT NULL REFERENCES patients(id),
  doctor_id BIGINT REFERENCES users(id), subjective TEXT NOT NULL, blood_pressure VARCHAR(30), temperature VARCHAR(30),
  weight VARCHAR(30), height VARCHAR(30), assessment TEXT NOT NULL, plan TEXT NOT NULL, medical_action TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE prescriptions (
  id BIGSERIAL PRIMARY KEY, medical_record_id BIGINT NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  medicine_details TEXT NOT NULL, notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX registrations_patient_idx ON registrations(patient_id);
CREATE INDEX queues_date_idx ON queues(queue_date);
CREATE INDEX medical_records_patient_idx ON medical_records(patient_id);

INSERT INTO users (name, email, password_hash, role) VALUES
('Super Admin', 'superadmin@klinik.test', '$2b$10$Q01nbYMRd5IbRAxoahUp7uY40i/vG4nLloho3Ot6PA./FirlyA2vG', 'Superadmin'),
('Admin Klinik', 'admin@klinik.test', '$2b$10$Q01nbYMRd5IbRAxoahUp7uY40i/vG4nLloho3Ot6PA./FirlyA2vG', 'Administrator'),
('dr. Andi Pratama', 'dokter@klinik.test', '$2b$10$cjMiw0Cy/vYns8HmCZK7eeCcFbSrhVuxGA5Wt4LMcb4Snwg34LnEC', 'Dokter'),
('Nadia Putri', 'petugas@klinik.test', '$2b$10$j5ZjeI7v4jORC/Y/rD87suS8IMjoh3etuVJBHEFyvoyJUXFjRW1TG', 'Petugas Pendaftaran')
ON CONFLICT (email) DO NOTHING;
