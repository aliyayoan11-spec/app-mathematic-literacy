# CLAUDE.md — Panduan Kerja untuk AI (Claude Code)

File ini dibaca otomatis oleh Claude Code setiap kali bekerja di repo ini. Ikuti semua aturan di bawah.

## 1. Tentang proyek

**PeluangKu** adalah aplikasi web pembelajaran materi **Peluang kelas 8 SMP** berbasis **Teori Beban Kognitif (CLT)**. Pengguna utama adalah siswa yang membukanya di **smartphone** (layar ±360–414 px), juga bisa di browser laptop. Tujuannya meningkatkan **literasi matematis** siswa, yang diukur dengan pretest–posttest 4 soal uraian (lihat `EVALUASI.md`).

Sebelum mengerjakan fitur apa pun, baca dokumen terkait:
- Kebutuhan & fitur → `PRD.md`
- Tampilan & interaksi → `DESAIN.md`
- Teknologi, folder, data → `ARSITEKTUR.md`
- Isi materi & soal → `KONTEN.md`
- Tes & penilaian → `EVALUASI.md`
- Urutan kerja → `TASKS.md` (centang tugas yang selesai)

## 2. Teknologi (jangan diganti tanpa izin)

- **Frontend: HTML + CSS + JavaScript murni (ES modules)**. Tanpa framework, tanpa build step, tanpa npm di frontend.
- Konten materi disimpan sebagai **file JSON** di `data/`.
- Penyimpanan progres: **localStorage** browser.
- Pengiriman hasil tes: **Google Apps Script Web App** → Google Sheets (URL di `js/config.js`).
- **Backend: satu serverless function Vercel `/api/chat`** (Node.js ≥ 18, file di `api/`) untuk chatbot pembimbing. Backend memanggil DeepSeek; frontend **tidak pernah** memanggil DeepSeek langsung.
- **API key** hanya di `.env` (lokal, dibaca dengan `dotenv`) dan di **Environment Variables Vercel** (online). Jangan pernah menulis API key di frontend, di kode, atau meng-commit `.env`. Contoh isian ada di `.env.example`.
- npm hanya untuk kebutuhan backend/pengembangan lokal (`dotenv`). Frontend tetap tanpa npm.
- Hosting: **Vercel**, terhubung ke repo GitHub yang sama.
- Jangan menambah library eksternal. Kalau benar-benar perlu, tanyakan dulu dan jelaskan alasannya.

## 3. Aturan desain WAJIB (turunan dari hasil wawancara siswa)

Aturan ini adalah inti penelitian. Jangan dilanggar demi "kelihatan lebih keren".

1. **Satu langkah per layar (chunking).** Jangan tampilkan seluruh penyelesaian sekaligus. Siswa menekan "Lanjut" untuk langkah berikutnya.
2. **Siswa mengatur tempo sendiri.** Tidak ada autoplay, timer, atau animasi yang berjalan sendiri. Selalu ada tombol "Kembali".
3. **Teks dan gambar menyatu.** Gambar/visual selalu berada tepat di atas teks yang membahasnya, di layar yang sama. Jangan pernah menyuruh siswa scroll jauh atau pindah halaman untuk mencari data soal.
4. **Data soal selalu terlihat.** Saat mengerjakan latihan, kotak soal tetap bisa dilihat (sticky/collapsible) selama siswa menjawab.
5. **Visual dulu, simbol kemudian.** Setiap konsep baru dimulai dari gambar konkret (koin, dadu, bola), lalu tabel/daftar, baru notasi (n(S), P(A)).
6. **Setiap angka harus jelas asalnya.** Jangan ada angka yang tiba-tiba berubah. Tulis langkah transformasinya (misal: "6/36 → dibagi 6 → 1/6").
7. **Hint bertingkat, bukan kunci jawaban.** Tombol Hint memberi petunjuk tipis dulu (level 1), lalu lebih jelas (level 2), lalu contoh langkah (level 3). Jawaban akhir tidak pernah ditampilkan lewat hint.
8. **Ajak siswa mengecek ulang.** Setelah menjawab, tampilkan pertanyaan cek kewajaran (misal: "Apakah peluangmu di antara 0 dan 1?").
9. **Tampilan bersih.** Maksimal 1 warna aksen + warna status (benar/salah). Tidak ada teks warna-warni, tidak ada ikon/dekorasi yang tidak membawa informasi.
10. **Teks pendek.** Satu blok penjelasan maksimal ±40 kata. Kalimat sederhana, sesuai bahasa siswa SMP.

## 4. Konvensi kode

- Bahasa antarmuka: **Bahasa Indonesia**. Nama variabel/fungsi: Bahasa Inggris atau Indonesia, tapi **konsisten** per file. Komentar boleh Bahasa Indonesia.
- Nama file: huruf kecil, pakai tanda hubung (`ruang-sampel.json`, `hint-panel.js`).
- Satu file JS = satu tanggung jawab (render layar, penyimpanan, penilaian, dst.).
- CSS memakai variabel di `css/tokens.css` (warna, ukuran, jarak). Jangan menulis kode warna langsung di komponen.
- Pecahan ditampilkan dengan komponen pecahan HTML/CSS (`<span class="frac">`), bukan teks "3/10", di layar materi.
- Semua tombol minimal 44×44 px dan bisa dipakai dengan keyboard.
- Konten (teks materi, soal, hint) **tidak boleh di-hardcode** di JS. Ambil dari `data/*.json`.

## 5. Privasi data siswa

- Siswa masuk memakai **kode siswa** (misal `S01`) dan kelas, bukan nama lengkap.
- Jangan mengirim data apa pun selain yang tercantum di `ARSITEKTUR.md` bagian "Data yang dikirim".
- Ke chatbot (DeepSeek) hanya dikirim **isi percakapan dan teks soal latihan yang sedang dikerjakan**. Kode siswa, kelas, dan data tes tidak pernah dikirim.

## 6. Cara menjalankan & mengecek

- Jalankan lokal **dengan chatbot**: `npm install` (sekali saja), isi `.env` dari `.env.example`, lalu `npm run dev` dan buka `http://localhost:8000`.
- Jalankan lokal **tanpa chatbot**: `python -m http.server 8000` di folder root, lalu buka `http://localhost:8000`. (File harus lewat server karena memakai `fetch` JSON dan ES modules.)
- Setiap selesai fitur, cek di lebar layar **360 px** (DevTools → mode perangkat) dan di laptop.
- Cek konsol browser: tidak boleh ada error.
- Validasi angka di konten: setiap jawaban kunci di `data/` harus benar secara matematis (hitung ulang).

## 7. Yang TIDAK boleh dilakukan

- Menampilkan kunci jawaban pretest/posttest di aplikasi.
- Memberi hint, contoh, umpan balik, atau **chatbot** di **mode tes** (pretest/posttest harus murni).
- Membuat chatbot memberi jawaban akhir latihan. Chatbot hanya membimbing proses berpikir (aturannya di `ARSITEKTUR.md` bagian Chatbot).
- Menambah gamifikasi berlebihan (poin berkedip, konfeti, suara) yang menambah *extraneous load*.
- Mengubah 4 soal tes di `data/tes.json` tanpa persetujuan (instrumen penelitian).
