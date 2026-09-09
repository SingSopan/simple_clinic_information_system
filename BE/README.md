# Mini Clinic Backend

REST API sistem klinik menggunakan Express, PostgreSQL, JWT untuk autentikasi, bcryptjs untuk password hashing, dan middleware authorization berdasarkan role.

## Cara instalasi

Persyaratan:

- Node.js 18 atau lebih baru.
- npm.
- PostgreSQL 12 atau lebih baru.

Instal dependensi dan buat file environment:

```powershell
cd BE
npm install
Copy-Item .env.example .env
```

## Konfigurasi `.env`

```dotenv
PORT=5000
NODE_ENV=development
JWT_SECRET=ganti-dengan-kunci-rahasia-panjang-minimal-32-karakter
JWT_EXPIRES_IN=8h
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=clinic_db
```

Keterangan:

- `PORT`: port HTTP backend.
- `NODE_ENV`: environment aplikasi.
- `JWT_SECRET`: Generate JWT token.
- `JWT_EXPIRES_IN`: masa berlaku token, misalnya `8h` atau `7d`.
- `DB_*`: konfigurasi koneksi PostgreSQL.

Contoh membuat JWT secret melalui Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Database dan migration

Buat database:

```sql
CREATE DATABASE clinic_db;
```

Untuk instalasi baru, jalankan skema lengkap:

```powershell
psql -U postgres -d clinic_db -f database\schema.sql
```

Untuk memperbarui database lama, jalankan:

```powershell
npm run db:migrate
```

Runner `database/migrate.js` membaca seluruh file `.sql` pada `database/migrations` berdasarkan urutan nama. Migration saat ini:

- `002_superadmin_users.sql`: menambahkan role Superadmin.
- `003_user_management.sql`: menambahkan status user, waktu pembaruan, dan akun Superadmin.

## Cara menjalankan

Development dengan auto-reload:

```powershell
npm run dev
```

Production/local biasa:

```powershell
npm start
```

Backend berjalan di `http://localhost:5000`. Endpoint utama tersedia dengan prefix `/api`, misalnya `POST /api/login`.

## Akun login awal

| Role | Email | Password |
| --- | --- | --- |
| Superadmin | `superadmin@klinik.test` | `admin123` |
| Administrator | `admin@klinik.test` | `admin123` |
| Dokter | `dokter@klinik.test` | `dokter123` |
| Petugas Pendaftaran | `petugas@klinik.test` | `petugas123` |

Password disimpan sebagai bcrypt hash. Gunakan endpoint login untuk memperoleh JWT:

```http
POST /api/login
Content-Type: application/json

{
  "email": "superadmin@klinik.test",
  "password": "admin123"
}
```

## Struktur project

```text
BE/
├── database/
│   ├── migrations/           # Perubahan skema bertahap
│   ├── migrate.js            # Migration runner
│   └── schema.sql            # Skema lengkap instalasi baru
├── docs/
│   └── ERD.md                # Diagram Mermaid database
├── postman/
│   └── Mini-Clinic-API.postman_collection.json
├── src/
│   ├── config/
│   │   └── db.js             # PostgreSQL connection pool
│   ├── controllers/          # Auth, klinik, dan user controller
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/               # Auth, health, dan clinic routes
│   ├── app.js                # Express configuration
│   └── server.js             # HTTP server entry point
├── tests/
│   └── queue-reset.test.js   # Verifikasi antrean kembali A001 per hari
├── .env.example
└── package.json
```

## Endpoint utama

- Authentication: `/api/login`, `/api/logout`, `/api/me`.
- User dan dokter: `/api/users`, `/api/doctors`.
- Pasien: `/api/patients`.
- Pendaftaran: `/api/registrations`.
- Antrean: `/api/queues`.
- Pemeriksaan: `/api/medical-records`.
- Resep: `/api/prescriptions`.
- Referensi form: `/api/reference-data`.

## Pengujian

Uji reset nomor antrean harian:

```powershell
npm run test:queue-reset
npm run test:medical-records
```

Import [collection Postman](postman/Mini-Clinic-API.postman_collection.json), jalankan request Login, kemudian collection akan menyimpan JWT ke variabel `token`.

ERD Mermaid tersedia di [docs/ERD.md](docs/ERD.md).
