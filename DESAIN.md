# DESAIN.md — Rancangan Desain Pembelajaran & Antarmuka

## 1. Prinsip desain berbasis Teori Beban Kognitif

| Prinsip CLT | Masalah dari wawancara | Wujud di aplikasi |
|---|---|---|
| **Segmenting / chunking** | Kaget kalau rumus langsung keluar (DS01) | Satu langkah per layar; indikator "Langkah 2 dari 5" |
| **Learner pacing** | Video terlalu cepat, tidak bisa mengikuti (EL3) | Tidak ada autoplay; tombol Lanjut & Kembali; boleh ulang modul |
| **Split-attention (hindari)** | Gambar dan teks beda halaman (EL1–EL2) | Visual tepat di atas teksnya; kotak soal selalu terlihat |
| **Signaling** | Angka berubah tanpa penjelasan (EL3) | Angka yang baru muncul diberi sorotan lembut + keterangan asal |
| **Coherence / redundancy** | Tulisan warna-warni bikin sakit mata (DS03) | Satu warna aksen; tanpa dekorasi; teks ≤ 40 kata per blok |
| **Worked example → fading** | Paham setelah ada contoh bertahap (GL1, GL3) | Contoh lengkap → contoh berlubang → soal mandiri |
| **Concreteness fading** | Paham kalau digambar dulu baru disimbolkan (GL1) | Gambar benda → tabel/daftar → notasi n(S), P(A) |
| **Fading hints / scaffolding** | Ingin hint tipis-tipis dulu (DS02) | Hint 3 level; jawaban tidak pernah dibuka |
| **Self-explanation / self-verification** | Cek ulang membantu menemukan salah (GL2) | Pertanyaan cek kewajaran setelah menjawab |
| **Pengetahuan prasyarat** | Prasyarat lemah memperbesar beban (IL3–IL5) | Modul 0 pecahan; tautan "ingat lagi" kecil di langkah yang memakai pecahan |

## 2. Alur layar

```
[Masuk] → [Pretest: Soal 1..4] → [Peta Modul]
                                     │
                    ┌────────────────┴───────────────┐
                    ▼                                 │
          [Layar Langkah materi] ×n                   │
                    ▼                                 │
          [Contoh bertahap] → [Latihan + Hint + Cek]  │
                    ▼                                 │
          [Ringkasan modul] (+ skala usaha mental) ───┘
                                     │ semua modul selesai
                                     ▼
                              [Posttest] → [Selesai]
```

## 3. Rancangan layar (wireframe teks, lebar 360 px)

### 3.1 Masuk
```
┌──────────────────────────┐
│ PeluangKu                │
│ Belajar peluang langkah  │
│ demi langkah.            │
│                          │
│ Kode siswa  [ S01      ] │
│ Kelas       [ 8B       ] │
│                          │
│ [        Mulai         ] │
└──────────────────────────┘
```

### 3.2 Peta modul
```
┌──────────────────────────┐
│ Halo, S01                │
│ ✓ 0  Ingat Pecahan       │
│ ● 1  Percobaan & Ruang…  │  ← sedang dikerjakan
│ ○ 2  Ruang Sampel 2 Benda│  ← terkunci sampai modul 1 selesai
│ ○ 3  Peluang Teoretis    │
│ ○ 4  Peluang Empirik     │
│ ○ 5  Frekuensi Harapan   │
│ ─────────────────────────│
│ ○ Posttest (terkunci)    │
└──────────────────────────┘
```

### 3.3 Layar langkah materi
```
┌──────────────────────────┐
│ ← Modul 2   Langkah 2/5  │
│ ▓▓▓▓░░░░░░               │  ← progres
│                          │
│   [ gambar 2 koin ]      │  ← visual di ATAS teks
│                          │
│ Koin pertama bisa A atau │
│ G. Koin kedua juga bisa  │
│ A atau G.                │
│                          │
│ [ Kembali ]  [ Lanjut ]  │  ← tombol di bawah, mudah dijangkau jempol
└──────────────────────────┘
```

### 3.4 Latihan dengan hint dan cek ulang
```
┌──────────────────────────┐
│ ▾ Soal (ketuk utk tutup) │  ← kotak soal sticky, selalu bisa dilihat
│ Kotak berisi 3 bola biru │
│ dan 7 bola merah. …      │
│──────────────────────────│
│ Tahap 1 dari 3           │
│ Berapa banyak semua bola?│
│ n(S) = [    ]            │
│                          │
│ [ Hint ]       [ Cek ]   │
│                          │
│ 💡 Hint 1: Jumlahkan bola│  ← muncul di bawah, tidak menutupi soal
│ biru dan bola merah.     │
└──────────────────────────┘
```
Setelah jawaban benar di tahap terakhir:
```
│ ✓ Benar. P = 3/10        │
│ Cek ulang: apakah 3/10   │
│ ada di antara 0 dan 1?   │
│ [ Ya ]  [ Tidak ]        │
```

### 3.5 Simulator
```
┌──────────────────────────┐
│ Lempar 1 dadu            │
│   [ ⚀ ]                  │
│ [Lempar 1×] [Lempar 10×] │
│                          │
│ Mata 6 muncul: 4 dari 30 │
│ Frekuensi relatif: 4/30  │
│ Peluang teoretis:  1/6   │
│ [grafik batang sederhana]│
└──────────────────────────┘
```
Siswa yang menekan tombol (bukan berjalan sendiri). Tidak ada animasi panjang.

### 3.6 Tes (pretest/posttest)
```
┌──────────────────────────┐
│ Pretest  Soal 1 dari 4   │
│ Memilih Permainan di     │
│ Bazar. …(soal lengkap)…  │
│                          │
│ Jawabanmu (tulis langkah │
│ penyelesaian):           │
│ [                      ] │
│ [                      ] │
│ [ Sebelumnya ][Berikutnya│
└──────────────────────────┘
```
Tanpa hint, tanpa umpan balik benar/salah. Di soal terakhir ada konfirmasi "Kirim jawaban?".

## 4. Umpan balik jawaban latihan

| Kondisi | Respons aplikasi |
|---|---|
| Benar | "✓ Benar." + penjelasan singkat asal angka; lanjut ke tahap berikutnya |
| Salah ke-1 | "Belum tepat. Coba periksa lagi." + tawarkan Hint 1 |
| Salah ke-2 | Tawarkan Hint 2 |
| Salah ke-3 | Tawarkan Hint 3 (contoh langkah serupa dengan angka lain) |
| Kesalahan umum yang dikenali | Umpan balik khusus. Misal jawab 3 untuk ruang sampel 2 koin → "Apakah AG dan GA sama? Koin pertama dan kedua berbeda." |

Kesalahan umum diambil dari pola jawaban pretest (lihat `KONTEN.md` bagian 4).

## 5. Gaya visual (design tokens)

| Token | Nilai | Pemakaian |
|---|---|---|
| `--bg` | `#FFFFFF` | Latar |
| `--surface` | `#F5F6F8` | Kotak soal, kartu |
| `--text` | `#1F2937` | Teks utama |
| `--muted` | `#6B7280` | Teks keterangan |
| `--accent` | `#2563EB` | Tombol utama, progres (**satu-satunya warna aksen**) |
| `--ok` | `#15803D` | Jawaban benar |
| `--err` | `#B91C1C` | Jawaban belum tepat |
| `--highlight` | `#FEF3C7` | Sorotan angka yang baru muncul |
| Font | `system-ui, sans-serif` | Tanpa unduh font |
| Ukuran teks | 18 px isi, 22 px judul, 16 px keterangan | |
| Jarak | kelipatan 8 px | |
| Sudut | 8 px | |
| Tombol | tinggi ≥ 48 px, lebar penuh di HP | |

Aturan:
- Tidak memakai lebih dari 3 warna dalam satu layar (teks, aksen, status).
- Ikon hanya jika membawa makna (✓, ✗, 💡 hint). Tidak ada maskot atau ilustrasi dekoratif.
- Visual matematika (koin, dadu, bola, tabel) dibuat dengan **SVG sederhana**, garis hitam/abu, warna hanya untuk membedakan (misal bola biru vs merah).

## 6. Representasi visual per konsep

| Konsep | Konkret (gambar) | Semi-abstrak | Abstrak (simbol) |
|---|---|---|---|
| Ruang sampel 1 koin/dadu | Gambar koin A/G, sisi dadu | Daftar {A, G} | n(S) = 2 |
| Ruang sampel 2 koin | Dua koin berdampingan | Diagram pohon / daftar AA, AG, GA, GG | n(S) = 4 |
| Titik sampel 2 dadu | Dua dadu berwarna beda | Tabel 6×6 yang diisi bertahap | n(S) = 6 × 6 = 36 |
| Pengambilan bola | Kotak berisi bola berwarna | Hitungan per warna | P(A) = n(A)/n(S) |
| Frekuensi relatif | Simulator lempar | Tabel turus | fr = banyak muncul / banyak percobaan |
| Frekuensi harapan | Gambar 60 kali lempar | "1 dari 6 → 10 dari 60" | Fh = P(A) × n |
