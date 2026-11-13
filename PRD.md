# PRD — Product Requirements Document
## PeluangKu: Media Pembelajaran Digital Materi Peluang Berbasis Teori Beban Kognitif

| | |
|---|---|
| Versi | 1.0 (draf perencanaan) |
| Tahap ADDIE | Analysis → Design |
| Materi | Peluang, Kelas 8 Semester 2 |
| Platform | Aplikasi web, mobile-first (smartphone & browser) |

---

## 1. Latar belakang masalah

### 1.1 Hasil pretest (analisis kebutuhan)
Pretest pilihan ganda 10 soal (Google Form, 2 siswa) menghasilkan rata-rata **25 dari 100**. Temuan utama:
- Soal yang **dikuasai**: rentang nilai peluang (0 ≤ P(A) ≤ 1) dan peluang empirik. Keduanya soal konsep/istilah tanpa hitungan.
- Soal yang **gagal** (0% benar): ruang sampel dua koin, titik sampel dua dadu, peluang dua koin, peluang jumlah mata dua dadu, pengambilan bola, frekuensi relatif, peluang satu mata dadu.
- Pola: kesulitan terbesar ada pada **menentukan ruang sampel/titik sampel**. Karena ruang sampel adalah dasar menghitung peluang, kesalahan ini merembet ke soal-soal berikutnya.

### 1.2 Hasil wawancara siswa (S01 & S02)
| Kode | Temuan | Jenis beban kognitif | Implikasi desain |
|---|---|---|---|
| K | Pembelajaran berpusat di papan tulis + latihan buku paket | Pengetahuan awal | Butuh contoh bertahap yang bisa diulang mandiri |
| IL1–IL2 | Bingung menerjemahkan kalimat soal cerita ke simbol | Intrinsic load tinggi | Jembatan narasi → gambar → simbol |
| IL3–IL5 | Prasyarat (operasi aljabar/pecahan) belum kuat | Intrinsic load | Modul prasyarat singkat + pengingat di tempat |
| EL1–EL2 | Teks soal dan gambar terpisah halaman, harus bolak-balik | Extraneous load (*split-attention*) | Teks & visual menyatu, data soal selalu terlihat |
| EL3 | Video terlalu cepat, angka berubah tanpa penjelasan | Extraneous load (tidak ada kontrol tempo) | Siswa mengatur tempo; setiap angka dijelaskan asalnya |
| GL1–GL3 | Paham jika ada pemisalan gambar dulu, baru simbol | Germane load | Visual → simbolik di setiap konsep |
| GL2 | Substitusi balik/cek ulang membantu menemukan kesalahan | Germane load | Fitur cek kewajaran (self-verification) |
| DS01 | Ingin langkah per langkah, tidak langsung rumus | Desain | Chunking: satu langkah per layar |
| DS02 | Ingin tombol Hint yang bertahap, bukan kunci jawaban | Desain | Fading hints 3 level |
| DS03 | Tidak suka tulisan warna-warni berlebihan | Desain | UI minimalis |

> **Catatan:** kutipan wawancara pada laporan memakai konteks SPLDV. Prinsip kebutuhan desain di atas berlaku umum dan diterapkan pada materi Peluang. *(Sesuaikan catatan ini dengan kondisi sebenarnya di laporan.)*

## 2. Tujuan produk

1. Siswa mampu menentukan **ruang sampel dan titik sampel** dengan benar (1 koin, 1 dadu, 2 koin, 2 dadu, pengambilan benda).
2. Siswa mampu menghitung **peluang teoretis, peluang empirik/frekuensi relatif, dan frekuensi harapan**.
3. Siswa mampu memakai konsep peluang untuk **menalar, memodelkan, menghitung, dan menafsirkan** masalah kontekstual (4 indikator literasi matematis).
4. Aplikasi menjadi sarana **uji efektivitas**: pretest → belajar dengan aplikasi → posttest.

## 3. Pengguna

| Pengguna | Kebutuhan |
|---|---|
| **Siswa kelas 8** (utama) | Belajar mandiri lewat HP; langkah pendek; bisa ulang; tidak malu bertanya karena ada hint |
| **Peneliti/guru** (Aliya) | Mengumpulkan skor dan jawaban pretest–posttest; melihat progres siswa |
| **Dosen/validator ahli** | Menilai kelayakan materi dan media |

**Persona singkat — "Rio", 14 tahun:** belajar matematika dari catatan papan tulis dan buku paket. Malu bertanya di kelas. Pakai HP Android layar kecil dengan kuota terbatas. Cepat bingung kalau rumus langsung keluar dan kalau angka "tiba-tiba muncul".

## 4. Ruang lingkup fitur

### 4.1 Wajib (MVP)
| ID | Fitur | Deskripsi | Dasar (wawancara/pretest) |
|---|---|---|---|
| F1 | **Masuk dengan kode siswa** | Isi kode siswa + kelas; tanpa password | Privasi |
| F2 | **Pretest** | 4 soal uraian literasi matematis, tanpa hint, jawaban per soal | Uji efektivitas |
| F3 | **Peta modul** | Daftar 6 modul berurutan dengan status (belum/sedang/selesai) | Struktur jelas |
| F4 | **Layar langkah (chunking)** | Materi disajikan 1 langkah per layar, tombol Kembali/Lanjut, indikator "Langkah x dari y" | DS01, EL3 |
| F5 | **Contoh soal bertahap (worked example → fading)** | Contoh lengkap → contoh dengan langkah kosong → soal mandiri | IL, GL |
| F6 | **Hint bertingkat** | 3 level petunjuk per langkah; jawaban akhir tidak dibuka | DS02 |
| F7 | **Cek kewajaran (self-verification)** | Setelah menjawab, siswa diajak mengecek: 0≤P≤1, jumlah peluang semua hasil = 1, bandingkan dengan simulasi | GL2 |
| F8 | **Penyusun ruang sampel interaktif** | Siswa menyusun ruang sampel dengan mengetuk/mengisi tabel (koin: daftar; dua dadu: tabel 6×6) | Pretest soal 2, 7, 8, 9 |
| F9 | **Simulator percobaan** | Lempar koin/dadu virtual n kali (siswa yang menekan tombol), lalu bandingkan frekuensi relatif dengan peluang teoretis | Pretest soal 5, 10 |
| F10 | **Posttest** | Soal sama dengan pretest; terbuka setelah semua modul selesai | Uji efektivitas |
| F11 | **Pengiriman hasil** | Jawaban pre/posttest + waktu dikirim ke Google Sheets | Peneliti |
| F12 | **Simpan progres otomatis** | Progres tersimpan di HP; bisa lanjut kapan saja | Belajar mandiri |

### 4.2 Tambahan (jika waktu cukup)
| ID | Fitur |
|---|---|
| F13 | **Skala usaha mental (Paas, 1–9)** di akhir tiap modul, untuk data beban kognitif penelitian |
| F14 | Ringkasan materi (1 halaman per modul) yang bisa dibuka lagi |
| F15 | Mode offline (Service Worker/PWA) |
| F16 | Halaman peneliti sederhana untuk melihat rekap (dari Google Sheets) |

### 4.3 Di luar cakupan
- Login dengan akun/password, chat, forum, leaderboard, video.
- Materi selain Peluang.
- Penilaian otomatis jawaban uraian pre/posttest (dinilai manual oleh peneliti dengan rubrik).

## 5. Alur utama pengguna (siswa)

```
Masuk (kode + kelas) → Pretest (4 soal) → Peta Modul
→ Modul 0 … Modul 5 (langkah → contoh → latihan + hint + cek ulang)
→ [opsional: skala usaha mental per modul]
→ Posttest (4 soal) → Selesai
```

## 6. Kebutuhan non-fungsional

| Aspek | Target |
|---|---|
| Perangkat | Nyaman di layar 360 px; tetap rapi di laptop |
| Kecepatan | Halaman pertama < 3 detik di 4G; total ukuran awal < 500 KB |
| Kuota | Tanpa video; gambar dibuat dengan SVG/CSS |
| Aksesibilitas | Teks minimal 16 px, kontras cukup (WCAG AA), tombol ≥ 44 px |
| Browser | Chrome Android, Safari iOS, Chrome/Edge desktop versi terbaru |
| Keandalan | Progres tidak hilang saat halaman di-refresh |
| Privasi | Hanya kode siswa, kelas, jawaban, dan waktu yang dikirim |

## 7. Kriteria keberhasilan

| Kriteria | Ukuran |
|---|---|
| Valid | Skor validasi ahli materi & ahli media kategori **layak/sangat layak** |
| Praktis | Angket respons siswa kategori **baik/sangat baik** |
| Efektif | Rata-rata **N-gain ≥ 0,3** (kategori sedang) dari pretest ke posttest literasi matematis |
| Beban kognitif | (Jika F13 dipakai) rata-rata usaha mental cenderung turun dari modul awal ke akhir |

## 8. Pemetaan ADDIE

| Tahap | Kegiatan | Dokumen/keluaran |
|---|---|---|
| Analysis | Pretest, wawancara siswa, analisis materi | Laporan pretest & wawancara, `PRD.md` bagian 1 |
| Design | Rancangan fitur, layar, konten, instrumen | `PRD.md`, `DESAIN.md`, `KONTEN.md`, `EVALUASI.md` |
| Development | Coding aplikasi, validasi ahli, revisi | Kode di repo, `TASKS.md` |
| Implementation | Uji coba ke siswa: pretest → aplikasi → posttest | Data Google Sheets |
| Evaluation | Analisis N-gain, angket, revisi akhir | Laporan akhir |

## 9. Risiko & mitigasi

| Risiko | Mitigasi |
|---|---|
| Sinyal/kuota siswa terbatas | Ukuran kecil, tanpa video, progres tersimpan lokal |
| Data tes gagal terkirim | Simpan dulu di localStorage, tombol "Kirim ulang", dan tombol "Salin jawaban" sebagai cadangan |
| Siswa ganti HP/browser | Progres hilang di perangkat baru; hasil tes tetap aman karena sudah terkirim |
| Peserta sedikit | Laporkan sebagai uji coba terbatas; analisis deskriptif |
