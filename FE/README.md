# Mini Clinic Frontend

Frontend sistem klinik berbasis React dan Vite. Seluruh data klinik diperoleh dari backend melalui Axios; browser hanya menyimpan JWT dan informasi sesi login.

## Cara instalasi

Pastikan Node.js 18 atau lebih baru tersedia, lalu jalankan:

```powershell
cd FE
npm install
Copy-Item .env.example .env
```

## Konfigurasi `.env`

```dotenv
VITE_API_URL=http://localhost:5000
```

`VITE_API_URL` adalah alamat server backend tanpa akhiran `/api`. Service Axios akan menambahkan `/api` secara otomatis. Jika variabel ini dikosongkan, frontend menggunakan `/api` dan proxy Vite pada `vite.config.js`.

Setelah mengubah `.env`, restart development server agar Vite memuat nilai terbaru.

## Cara menjalankan

Mode development:

```powershell
npm run dev
```

Aplikasi tersedia di `http://localhost:3000`. Backend harus berjalan pada alamat yang ditentukan oleh `VITE_API_URL`.

Build production:

```powershell
npm run build
npm run preview
```

Hasil build disimpan di folder `dist`.

## Akun login awal

| Role | Email | Password | Akses utama |
| --- | --- | --- | --- |
| Superadmin | `superadmin@klinik.test` | `admin123` | Semua modul dan manajemen user |
| Administrator | `admin@klinik.test` | `admin123` | Operasional klinik |
| Dokter | `dokter@klinik.test` | `dokter123` | Antrean dan pemeriksaan SOAP |
| Petugas Pendaftaran | `petugas@klinik.test` | `petugas123` | Pasien, pendaftaran, dan antrean |

Backend menerbitkan JWT ketika login berhasil. Frontend menambahkan token tersebut ke header `Authorization: Bearer <token>` pada request API.

## Struktur project

```text
FE/
├── src/
│   ├── components/
│   │   ├── Badge/                # Badge status
│   │   ├── Button/               # Tombol reusable
│   │   ├── Card/                 # Container card
│   │   ├── LoadingSpinner/       # Indikator loading
│   │   ├── Modal/                # Dialog modal
│   │   ├── Navbar/               # Navbar dan toggle sidebar
│   │   ├── Pagination/           # Navigasi halaman
│   │   ├── ProtectedRoute/       # Proteksi JWT dan role
│   │   ├── SearchBar/            # Input pencarian
│   │   ├── Sidebar/              # Sidebar responsive
│   │   └── Table/                # Tabel reusable
│   ├── features/
│   │   ├── auth/                 # Login dan logout
│   │   ├── dashboard/            # Ringkasan klinik
│   │   ├── examination/          # SOAP dan riwayat pasien
│   │   ├── patients/             # CRUD pasien
│   │   ├── queue/                # Antrean harian
│   │   ├── registration/         # Pendaftaran kunjungan
│   │   └── users/                # Manajemen user Superadmin
│   ├── hooks/                    # Shared hooks
│   ├── pages/                    # Route-level pages
│   ├── services/                 # Axios dan endpoint API
│   ├── store/                    # Auth, clinic, dan queue state
│   ├── utils/                    # Format tanggal dan helper
│   ├── App.jsx                   # Routing dan role authorization
│   ├── index.css                 # Design system global
│   └── main.jsx                  # Entry point React
├── .env.example
├── package.json
└── vite.config.js
```

## Migration database

Frontend tidak menjalankan migration. Ikuti petunjuk migration di [README backend](../BE/README.md).

