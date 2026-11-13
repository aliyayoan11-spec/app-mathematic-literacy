# KONTEN.md — Rancangan Materi Peluang (Kelas 8 Semester 2)

## 1. Capaian & tujuan pembelajaran

Siswa mampu:
1. Menjelaskan percobaan, hasil (titik sampel), ruang sampel, dan kejadian.
2. Menentukan ruang sampel satu benda (koin, dadu) dan dua benda (dua koin, dua dadu) dengan daftar, diagram pohon, atau tabel.
3. Menghitung peluang teoretis P(A) = n(A)/n(S) dan memahami 0 ≤ P(A) ≤ 1.
4. Menghitung peluang empirik/frekuensi relatif dari data percobaan dan membandingkannya dengan peluang teoretis.
5. Menghitung frekuensi harapan Fh = P(A) × n.
6. Memakai konsep-konsep di atas untuk menalar, memodelkan, dan menafsirkan masalah sehari-hari.

## 2. Urutan modul

Urutan disusun dari yang paling sederhana (intrinsic load rendah) ke kompleks. Modul 1–2 diberi porsi terbanyak karena ruang sampel adalah kelemahan terbesar di pretest.

| Modul | Judul | Isi pokok | Kaitan pretest | Perkiraan waktu |
|---|---|---|---|---|
| 0 | Ingat Lagi Pecahan | Menyederhanakan pecahan, membandingkan pecahan (samakan penyebut), pecahan ↔ desimal | Prasyarat (IL3–IL5) | 10 menit |
| 1 | Percobaan & Ruang Sampel | Istilah percobaan, titik sampel, ruang sampel, kejadian; 1 koin, 1 dadu, ambil 1 bola | Soal 1, 3 | 15 menit |
| 2 | Ruang Sampel Dua Benda | Dua koin (pohon/daftar), dua dadu (tabel 6×6), aturan perkalian | Soal 2, 7 | 20 menit |
| 3 | Peluang Teoretis | P(A) = n(A)/n(S); rentang 0–1; kejadian pasti & mustahil; peluang dua koin & jumlah mata dua dadu | Soal 1, 3, 4, 8, 9 | 20 menit |
| 4 | Peluang Empirik | Frekuensi relatif dari data; simulator; makin banyak percobaan makin dekat ke peluang teoretis | Soal 5, 10 | 15 menit |
| 5 | Frekuensi Harapan | Fh = P(A) × n; menafsirkan hasil dalam konteks | Soal 6 | 15 menit |

Setiap modul memakai pola yang sama:
```
Penjelasan (visual → simbol) → Contoh lengkap → Contoh berlubang → Latihan mandiri (hint + cek ulang) → Ringkasan
```

## 3. Contoh rancangan isi: Modul 2 "Ruang Sampel Dua Benda"

**Langkah 1 — Penjelasan (visual):** gambar dua koin. "Koin pertama bisa A atau G. Koin kedua juga bisa A atau G."

**Langkah 2 — Penjelasan (semi-abstrak):** diagram pohon yang muncul cabang demi cabang setiap siswa menekan Lanjut.
```
Koin 1     Koin 2     Hasil
  A ────── A          AA
     └──── G          AG
  G ────── A          GA
     └──── G          GG
```

**Langkah 3 — Penjelasan (simbol):** "S = {AA, AG, GA, GG}, jadi n(S) = 4. Perhatikan: AG dan GA **berbeda**, karena yang pertama koin 1 = A, yang kedua koin 1 = G."

**Langkah 4 — Aturan perkalian:** "2 kemungkinan × 2 kemungkinan = 4." Disorot asal angkanya.

**Langkah 5 — Dua dadu dengan tabel 6×6:** siswa mengisi baris pertama sendiri ((1,1) … (1,6)), lalu aplikasi melengkapi sisanya. "6 baris × 6 kolom = 36 titik sampel."

**Langkah 6 — Contoh berlubang:** "Satu koin dan satu dadu dilempar. Banyak titik sampel = [ ] × [ ] = [ ]."

**Langkah 7 — Latihan mandiri** (dengan hint 3 level dan umpan balik kesalahan umum, lihat bagian 4).

**Langkah 8 — Ringkasan:** "Banyak titik sampel dua benda = banyak hasil benda 1 × banyak hasil benda 2."

## 4. Kesalahan umum dari pretest → umpan balik khusus

| Topik | Jawaban salah siswa | Dugaan penyebab | Umpan balik di aplikasi |
|---|---|---|---|
| Peluang satu mata dadu | 1/2, 1/3 | Tidak menghitung semua sisi dadu | "Dadu punya berapa sisi? Hitung semua kemungkinan dulu." |
| Ruang sampel dua koin | 3 | Menganggap AG = GA | "Apakah AG dan GA sama? Koin pertama dan kedua berbeda." |
| Ruang sampel dua koin | 2 | Memakai ruang sampel satu koin | "Itu untuk satu koin. Di sini ada dua koin." |
| Pengambilan bola | 1/3 (dari 3 biru, 10 bola) | Membandingkan biru dengan banyak warna, bukan banyak bola | "Penyebutnya adalah **semua bola**, bukan banyak warna." |
| Frekuensi relatif | 28/22 | Membandingkan dua frekuensi, bukan frekuensi dengan total | "Pembaginya adalah **banyak percobaan seluruhnya**." |
| Frekuensi relatif | 11/25 | Memakai kejadian lawan | "Cek lagi: kejadian mana yang ditanyakan?" |
| Titik sampel dua dadu | 12 | Menjumlahkan 6 + 6 | "Setiap mata dadu 1 bisa berpasangan dengan 6 mata dadu 2. Dijumlah atau dikali?" |
| Titik sampel dua dadu | 24 | Tebakan/kelipatan | "Coba isi tabel 6×6. Ada berapa kotak?" |
| Peluang dua koin (AA) | 1/2, 3/4 | Ruang sampel salah | "Tulis dulu ruang sampelnya. Ada berapa hasil? Berapa yang AA?" |
| Jumlah mata dua dadu = 7 | 1/12, 1/9 | Kejadian tidak didaftar lengkap | "Daftar semua pasangan yang jumlahnya 7, mulai dari (1,6)." |

## 5. Pola hint bertingkat

| Level | Isi | Contoh (menghitung n(S) dua dadu) |
|---|---|---|
| 1 — Arah | Mengingatkan apa yang perlu dilakukan | "Ingat, dadu pertama dan kedua masing-masing punya 6 mata." |
| 2 — Strategi | Memberi cara/alat | "Bayangkan tabel: baris = dadu 1, kolom = dadu 2." |
| 3 — Contoh serupa | Contoh dengan angka lain, bukan jawaban | "Untuk 1 koin dan 1 dadu: 2 × 6 = 12." |

Jawaban akhir **tidak pernah** ditampilkan oleh hint. Setelah salah 3 kali dan semua hint dipakai, tampilkan tombol "Lihat pembahasan" yang menjelaskan langkahnya. Pembahasan ini dicatat sebagai `pembahasanDibuka: true`.

## 6. Pertanyaan cek ulang (self-verification)

Dipakai setelah siswa menyelesaikan latihan:
- "Apakah peluangmu di antara 0 dan 1?"
- "Jika kamu jumlahkan peluang semua hasil yang mungkin, apakah hasilnya 1?"
- "Coba simulasikan 50 kali. Apakah frekuensi relatifnya mendekati jawabanmu?"
- "Frekuensi harapanmu lebih besar dari banyak percobaan? Masuk akal tidak?"

## 7. Latihan literasi di akhir modul

Setiap modul (1–5) ditutup dengan satu soal kontekstual singkat yang melatih salah satu indikator literasi matematis (bernalar, merumuskan, menerapkan, menafsirkan). Soal-soal ini **berbeda** dari soal pretest/posttest agar tes tetap murni. Contoh konteks: undian kelas, kantin sekolah, permainan bazar, cuaca, kuis.
