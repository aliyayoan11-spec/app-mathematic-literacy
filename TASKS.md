# TASKS.md — Rencana Kerja Coding

Centang `[x]` setiap tugas yang selesai. Kerjakan berurutan. Satu tahap selesai dan dicek di HP dulu, baru lanjut ke tahap berikutnya.

## Tahap 0 — Persiapan
- [ ] Buat repo GitHub dan unggah semua dokumen perencanaan *(repo git lokal sudah dibuat + commit awal; tinggal buat repo di GitHub lalu push)*
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
- [ ] Pemuat JSON modul
- [ ] Layar Langkah: tipe `penjelasan` (visual di atas, teks di bawah, Kembali/Lanjut, progres)
- [ ] Tipe `contoh`: tahap muncul satu per satu
- [ ] Komponen pecahan (`fraction.js`)
- [ ] Komponen visual SVG: koin, dadu, bola (`visuals.js`)
- [ ] Sorotan untuk angka yang baru muncul

## Tahap 3 — Latihan interaktif
- [ ] Layar Latihan: kotak soal sticky + kolom jawaban per tahap
- [ ] Pemeriksa jawaban (normalisasi, kesetaraan pecahan, `terimaJuga`)
- [ ] Umpan balik `salahUmum`
- [ ] Panel hint 3 level + pencatatan hint dipakai
- [ ] Pertanyaan cek ulang
- [ ] Tombol "Lihat pembahasan" setelah 3× salah

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
- [ ] Deploy ke GitHub Pages, buat QR code link
- [ ] Uji coba kecil (1–2 orang), catat masukan, revisi
- [ ] Siap untuk validasi ahli materi & media
