# Informatika SMA — Digital Learning Hub & Roadmap Pertemuan 1–10

Website statis portal pembelajaran Informatika SMA Kelas 10 dan Kelas 11–12 (Gabungan) dengan sistem penguncian materi (*content availability lock*) serta integrasi file dokumen Microsoft Word (`.docx`).

---

## 🗺️ Roadmap Materi Pertemuan 1–10

### Kelas 10
| Pertemuan | Judul Materi | Status |
| :---: | :--- | :---: |
| 1 | Pengenalan Teknologi Informasi & Informatika | 🔓 Terbuka |
| 2 | Pemrosesan & Penyimpanan Komputer | 🔓 Terbuka |
| 3 | Sistem Operasi & Manajemen File | 🔓 Terbuka |
| 4 | Jaringan Komputer & Internet | 🔓 Terbuka |
| 5 | Keamanan Digital | 🔓 Terbuka |
| 6 | Berpikir Komputasional | 🔒 Terkunci |
| 7 | Analisis Data Dasar | 🔒 Terkunci |
| 8 | Algoritma & Pemrograman Dasar | 🔒 Terkunci |
| 9 | Dampak Sosial Informatika | 🔒 Terkunci |
| 10 | TIK dan Aplikasi Perkantoran | 🔒 Terkunci |

### Kelas 11–12 (Gabungan)
| Pertemuan | Judul Materi | Status |
| :---: | :--- | :---: |
| 1 | Pengantar Jaringan Komputer | 🔓 Terbuka |
| 2 | Jenis & Topologi Jaringan | 🔓 Terbuka |
| 3 | Perangkat Jaringan & Media Transmisi | 🔓 Terbuka |
| 4 | IP Address & Subnetting Dasar | 🔓 Terbuka |
| 5 | Konfigurasi Jaringan Sederhana | 🔓 Terbuka |
| 6 | Keamanan Jaringan | 🔒 Terkunci |
| 7 | Koneksi dan Berbagi Sumber Daya dalam Jaringan | 🔒 Terkunci |
| 8 | Pemeriksaan dan Troubleshooting Jaringan Dasar | 🔒 Terkunci |
| 9 | Mengenal Internet dan Cara Kerja Akses Jaringan | 🔒 Terkunci |
| 10 | Pemanfaatan Cloud Storage & Kolaborasi Online | 🔒 Terkunci |

---

## 🔒 Sistem Penguncian & Cara Developer Membuka Kunci (Unlock)

- **Pertemuan 1–5**: Berstatus `locked: false` (Terbuka).
- **Pertemuan 6–10**: Berstatus `locked: true` (Terkunci).

### Cara Developer Membuka Kunci (Unlock):
1. Buka file `assets/data/materials.json`.
2. Cari materi pertemuan yang ingin dibuka (misal `informatika-kelas-10-p6`).
3. Ubah nilai `"locked": true` menjadi `"locked": false`.
4. Ubah `"document"` jika file sudah tersedia:
   ```json
   "document": {
     "available": true,
     "file": "assets/materials/kelas-10/pertemuan-06/materi.docx"
   }
   ```
5. Simpan file JSON dan muat ulang halaman website. Materi akan terbuka secara otomatis.

---

## 📄 Struktur File Microsoft Word (`.docx`)

File dokumen `.docx` disimpan pada direktori berikut:

```text
assets/materials/
├── kelas-10/
│   ├── pertemuan-01/materi.docx
│   ├── pertemuan-02/materi.docx
│   ├── pertemuan-03/materi.docx
│   ├── pertemuan-04/materi.docx
│   └── pertemuan-05/materi.docx
│
└── kelas-11-12/
    ├── pertemuan-01/materi.docx
    ├── pertemuan-02/materi.docx
    ├── pertemuan-03/materi.docx
    ├── pertemuan-04/materi.docx
    └── pertemuan-05/materi.docx
```

Materi yang berstatus terbuka menampilkan tombol **Preview** (modal info) dan **Download DOCX** (`<a download>`). Materi terkunci tidak menampilkan akses dokumen.

---

## 💻 Cara Menjalankan Website

Buka folder `Web SMA Informatika` dan klik ganda pada file `index.html`. Tidak memerlukan `npm`, `node_modules`, atau backend server.
