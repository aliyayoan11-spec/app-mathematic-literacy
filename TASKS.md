# TASKS.md — Rencana Kerja Coding

Centang `[x]` setiap tugas yang selesai. Kerjakan berurutan. Satu tahap selesai dan dicek di HP dulu, baru lanjut ke tahap berikutnya.

## Tahap 0 — Persiapan
- [x] Buat repo GitHub dan unggah semua dokumen perencanaan
- [x] Buat struktur folder sesuai `ARSITEKTUR.md`
- [x] `index.html` kosong + `css/tokens.css` (warna & ukuran dari `DESAIN.md`)
- [ ] Jalankan lokal dengan `python -m http.server 8000` *(Python belum terpasang di laptop ini; sudah diuji dengan server lokal pengganti)*

## Tahap 1 — Kerangka aplikasi
- [x] Router hash sederhana (`js/main.js`)
- [x] `state.js`: simpan/baca localStorage (`peluangku_v1`)
- [x] Layar Masuk (kode siswa + kelas, validasi tidak boleh kosong)
- [x] Layar Peta Modul (status terkunci/sedang/selesai)
- [x] Cek tampilan di lebar 360 px

## Tahap 2 — Mesin materi
- [x] Pemuat JSON modul
- [x] Layar Langkah: tipe `penjelasan` (visual di atas, teks di bawah, Kembali/Lanjut, progres)
- [x] Tipe `contoh`: tahap muncul satu per satu
- [x] Komponen pecahan (`fraction.js`)
- [x] Komponen visual SVG: koin, dadu, bola (`visuals.js`) — ditambah batang pecahan
- [x] Sorotan untuk angka yang baru muncul

## Tahap 3 — Latihan interaktif
- [ ] Layar Latihan: kotak soal sticky + kolom jawaban per tahap
- [ ] Pemeriksa jawaban (normalisasi, kesetaraan pecahan, `terimaJuga`)
- [ ] Umpan balik `salahUmum`
- [ ] Panel hint 3 level + pencatatan hint dipakai
- [ ] Pertanyaan cek ulang
- [ ] Tombol "Lihat pembahasan" setelah 3× salah

## Tahap C — Chatbot pembimbing (RMT, DeepSeek via Vercel)
Backend boleh dikerjakan lebih dulu; tampilan chat setelah layar latihan (Tahap 3) jadi.
- [x] Perbarui `CLAUDE.md` dan `ARSITEKTUR.md` (backend, API key, privasi, aturan chatbot)
- [x] `.gitignore` memuat `.env`; buat `.env.example` dan `package.json` (dotenv)
- [x] `api/chat.js` + `api/_lib/validasi.js` + `api/_lib/prompt.js` (tanpa jawaban akhir, hint bertingkat, aturan beban kognitif)
- [x] `dev-server.js` untuk menjalankan lokal dengan `.env`
- [x] Isi `TAHAPAN_RMT` di `api/_lib/prompt.js` dari ringkasan RMT **versi dosen** (teks lengkap di `docs/rmt-ringkasan-dosen.md`)
- [x] Aturan beban kognitif dari wawancara (PRD.md 1.2, DESAIN.md 1) + kesalahan umum hasil uji coba soal
- [x] Pesan galat yang jelas per jenis kegagalan API (`api/_lib/galat.js`), diuji dengan DeepSeek tiruan
- [x] Pasang Node.js, `npm install`, isi `.env`
- [ ] Tunjukkan tabel tahapan RMT (ARSITEKTUR.md 8.1) ke dosen untuk persetujuan
- [ ] **Setelah top up saldo DeepSeek:** uji `/api/chat` dengan key asli (siswa mendesak minta jawaban, menebak, mengaku guru, salah ruang sampel, salah frekuensi relatif, salah peluang bola)
- [ ] Hubungkan repo ke Vercel + isi Environment Variables `DEEPSEEK_API_KEY`
- [ ] Frontend: `js/chat-api.js` + panel "Tanya pembimbing" di layar latihan (tidak ada di mode tes)
- [ ] Uji perilaku: chatbot tidak membocorkan jawaban akhir walau didesak; pesan singkat, satu pertanyaan
- [ ] Perbarui `PRD.md` (chat saat ini tertulis "di luar cakupan") setelah disetujui dosen

## Tahap 4 — Komponen khusus Peluang
- [ ] Penyusun ruang sampel dua koin (daftar/pohon interaktif)
- [ ] Tabel 6×6 dua dadu yang bisa diisi/diketuk
- [ ] Simulator lempar koin/dadu (1× dan 10×) + tabel turus + grafik batang sederhana

## Tahap 5 — Konten
- [ ] Tulis `modul-0` s.d. `modul-5` (JSON) sesuai `KONTEN.md`
- [ ] Hitung ulang semua kunci jawaban
- [ ] Tulis `tes.json` (4 soal Tabel 2, persis sama)

## Tahap 6 — Tes & pengiriman data
- [ ] Layar Tes (mode pre & post), tanpa hint/umpan balik
- [ ] Aturan akses: pretest dulu; posttest setelah semua modul selesai
- [ ] Buat Google Sheet (tab `Pretest`, `Posttest`) + Apps Script `doPost`, deploy Web App
- [ ] `api.js`: kirim, tangani gagal, kirim ulang, salin jawaban
- [ ] (Opsional) Skala usaha mental per modul

## Tahap 7 — Penyelesaian
- [ ] Uji di HP Android & iPhone/Safari (kalau ada) dan laptop
- [ ] Cek kontras warna & ukuran tombol
- [ ] Deploy ke Vercel (repo GitHub yang sama), matikan GitHub Pages lama, buat QR code link
- [ ] Uji coba kecil (1–2 orang), catat masukan, revisi
- [ ] Siap untuk validasi ahli materi & media
