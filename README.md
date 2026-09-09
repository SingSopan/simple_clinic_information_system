# Simple Clinic Information System

Aplikasi klinik sederhana yang terdiri dari frontend React dan REST API Express. Sistem menyediakan autentikasi JWT, otorisasi berdasarkan role, manajemen user, data pasien, pendaftaran, antrean harian, pemeriksaan SOAP, resep, dan dashboard.

## Teknologi

- Frontend: React 18, Vite, React Router, Zustand, Axios, dan Lucide React.
- Backend: Node.js, Express, JWT, bcryptjs, dan PostgreSQL.
- Database: PostgreSQL dengan skema SQL dan migration runner.

## Persyaratan

- Node.js 18 atau lebih baru.
- npm.
- PostgreSQL 12 atau lebih baru.
- `psql` opsional apabila ingin mengimpor skema melalui terminal.

## Cara instalasi

Clone atau salin project, kemudian masuk ke direktori project:

```powershell
cd simple_clinic_information_system
```

Instal dependensi backend dan frontend:

```powershell
cd BE
npm install
cd ..\FE
npm install
```

Salin konfigurasi environment:

```powershell
Copy-Item BE\.env.example BE\.env
Copy-Item FE\.env.example FE\.env
```

Sesuaikan kredensial PostgreSQL dan `JWT_SECRET` di `BE/.env`.

## Konfigurasi database

Buat database PostgreSQL:

```sql
CREATE DATABASE clinic_db;
```

Untuk instalasi baru, impor skema lengkap:

```powershell
psql -U postgres -d clinic_db -f BE\database\schema.sql
```

Untuk database yang sudah menggunakan versi skema sebelumnya, jalankan migration runner:

```powershell
cd BE
npm run db:migrate
```


## Cara menjalankan aplikasi

Jalankan backend pada terminal pertama:

```powershell
cd BE
npm run dev
```

Backend berjalan pada `http://localhost:5000` dan API tersedia di `http://localhost:5000/api`.

Jalankan frontend pada terminal kedua:

```powershell
cd FE
npm run dev
```

Buka `http://localhost:3000`.

## Akun login awal

| Role | Email | Password |
| --- | --- | --- |
| Superadmin | `superadmin@klinik.test` | `admin123` |
| Administrator | `admin@klinik.test` | `admin123` |
| Dokter | `dokter@klinik.test` | `dokter123` |
| Petugas Pendaftaran | `petugas@klinik.test` | `petugas123` |

Akun tersebut dibuat oleh `BE/database/schema.sql`. Superadmin dapat membuat akun baru dan menentukan role melalui menu Manajemen User.

## Struktur project

```text
simple_clinic_information_system/
├── BE/
│   ├── database/          # Skema dan migration database
│   ├── docs/              # ERD Mermaid
│   ├── postman/           # Collection pengujian API
│   ├── src/
│   │   ├── config/        # Koneksi PostgreSQL
│   │   ├── controllers/   # Logika endpoint
│   │   ├── middleware/    # JWT dan role authorization
│   │   └── routes/        # Route Express
│   └── tests/             # Pengujian backend
├── FE/
│   └── src/
│       ├── components/    # UI reusable
│       ├── features/      # Modul berdasarkan fitur
│       ├── pages/         # Halaman route
│       ├── services/      # Axios dan pemanggilan API
│       ├── store/         # Zustand stores
│       ├── hooks/         # Shared hooks
│       └── utils/         # Helper
└── README.md
```

Dokumentasi lebih rinci tersedia di [README frontend](FE/README.md) dan [README backend](BE/README.md). Collection pengujian terdapat di [Postman](BE/postman/Mini-Clinic-API.postman_collection.json), sedangkan diagram database tersedia di [ERD](BE/docs/ERD.md).

## Pengujian

```powershell
cd FE
npm run build

cd ..\BE
npm run test:queue-reset
```

