# EVALUASI.md — Instrumen & Rencana Uji Efektivitas

## 1. Desain uji coba

**One group pretest–posttest design.**
```
O1 (pretest)  →  X (belajar dengan PeluangKu)  →  O2 (posttest)
```
- O1 dan O2 memakai **4 soal yang sama**: soal Mathematical Literacy materi Peluang (Tabel 2).
- Tes dikerjakan di aplikasi (mode tes, tanpa hint dan umpan balik), lalu dinilai **manual** oleh peneliti memakai rubrik per tahap.

## 2. Instrumen tes (disimpan di `data/tes.json`)

| No | Indikator | Judul soal | Konsep | Skor maks |
|---|---|---|---|---|
| 1 | Mathematical Reasoning | Memilih Permainan di Bazar | Peluang satu dadu, dua koin, pengambilan bola; membandingkan pecahan | 6 |
| 2 | Formulating Situations Mathematically | Hadiah Stan Dua Dadu | Titik sampel dua dadu, frekuensi harapan | 6 |
| 3 | Employing Concepts, Facts, and Procedures | Percobaan Pelemparan Dadu | Frekuensi relatif dari tabel | 6 |
| 4 | Interpreting, Applying, and Evaluating | Pendapat Doni tentang Dua Koin | Ruang sampel dua koin, peluang teoretis vs empirik | 6 |
| | | | **Total** | **24** |

Teks soal lengkap dan kisi-kisi jawaban per tahap: lihat dokumen Tabel 2 (file `.docx`).

Rubrik skor per tahap:
- Soal 1: Tahap 1 = 1; Tahap 2 = 2; Tahap 3 = 1; Tahap 4 = 1; Tahap 5 = 1
- Soal 2: Tahap 1–6 masing-masing 1
- Soal 3: Tahap 1 = 1; Tahap 2 = 2; Tahap 3 = 2; Tahap 4 = 1
- Soal 4: Tahap 1–6 masing-masing 1

**Pedoman:** skor parsial tetap diberikan untuk tahap yang benar meskipun tahap berikutnya salah hitung, karena yang diukur adalah proses literasi matematis.

## 3. Analisis data

### 3.1 Skor
- Skor setiap siswa: 0–24 untuk pretest dan posttest.
- Skor per indikator: 0–6. Ini menunjukkan indikator mana yang paling meningkat.

### 3.2 N-gain (Hake)
```
g = (skor posttest − skor pretest) / (24 − skor pretest)
```
| Nilai g | Kategori |
|---|---|
| g ≥ 0,7 | Tinggi |
| 0,3 ≤ g < 0,7 | Sedang |
| g < 0,3 | Rendah |

Hitung g per siswa dan rata-ratanya, juga per indikator (ganti 24 dengan 6).

### 3.3 Uji statistik
Jika peserta cukup banyak (≥ 15–20), lakukan uji normalitas lalu uji-t berpasangan (atau Wilcoxon jika tidak normal). Jika peserta sedikit (misalnya 2 siswa), laporkan secara **deskriptif** saja.

## 4. Data pendukung dari aplikasi

| Data | Kegunaan |
|---|---|
| Banyak hint dipakai per latihan | Melihat bagian materi yang masih berat |
| Banyak percobaan menjawab | Indikasi kesulitan |
| Pembahasan dibuka | Bagian yang perlu revisi konten |
| Skala usaha mental 1–9 (Paas) per modul *(opsional)* | Indikator beban kognitif yang dirasakan |
| Durasi pengerjaan tes | Perbandingan pretest vs posttest |

Skala Paas ditampilkan di akhir modul:
> "Seberapa besar usaha yang kamu keluarkan untuk memahami modul ini?"
> 1 = sangat-sangat ringan … 5 = sedang … 9 = sangat-sangat berat

## 5. Validasi & kepraktisan (tahap Development & Implementation)

| Instrumen | Penilai | Aspek |
|---|---|---|
| Lembar validasi ahli materi | Dosen/guru matematika | Kesesuaian materi, kebenaran konsep, kesesuaian soal dengan indikator literasi |
| Lembar validasi ahli media | Dosen/ahli TIK | Tampilan, navigasi, keterbacaan, penerapan prinsip CLT |
| Angket respons siswa | Siswa | Kemudahan, kejelasan langkah, kegunaan hint, kenyamanan tampilan |

Skala Likert 1–4 atau 1–5; persentase kelayakan dikategorikan (misalnya ≥ 81% sangat layak).

## 6. Jadwal uji coba (usulan)

| Pertemuan | Kegiatan | Durasi |
|---|---|---|
| 1 | Pengenalan aplikasi + pretest | 45 menit |
| 2 | Modul 0–2 | 45–60 menit |
| 3 | Modul 3–5 | 45–60 menit |
| 4 | Posttest + angket respons | 45 menit |
