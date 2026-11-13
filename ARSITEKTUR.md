# ARSITEKTUR.md — Rancangan Teknis

## 1. Pilihan teknologi

| Bagian | Pilihan | Alasan |
|---|---|---|
| Tampilan | HTML + CSS + JavaScript murni (ES modules) | Ringan, tanpa instalasi, mudah dipahami mahasiswa, cocok untuk HP spesifikasi rendah |
| Konten | File JSON di `data/` | Materi bisa direvisi (setelah validasi ahli) tanpa mengubah kode |
| Visual matematika | SVG inline | Tajam di semua layar, ukurannya kecil |
| Penyimpanan progres | `localStorage` | Tanpa server/database, progres tetap ada saat refresh |
| Pengumpulan data tes | Google Apps Script Web App → Google Sheets | Gratis, sudah familiar (sebelumnya membuat Google Form dengan Apps Script) |
| Hosting | GitHub Pages | Gratis, link bisa dibagikan ke siswa |

## 2. Struktur folder

```
/
├── index.html              # satu halaman; layar diganti oleh JS (single-page)
├── css/
│   ├── tokens.css          # variabel warna, ukuran, jarak (lihat DESAIN.md)
│   ├── base.css            # reset & tipografi
│   └── components.css      # tombol, kartu, pecahan, hint, tabel sampel
├── js/
│   ├── main.js             # titik masuk, router sederhana (#/masuk, #/modul/2/langkah/3)
│   ├── config.js           # URL Apps Script, versi aplikasi
│   ├── state.js            # baca/tulis localStorage
│   ├── api.js              # kirim hasil tes ke Apps Script (+ antrean kirim ulang)
│   ├── screens/
│   │   ├── login.js
│   │   ├── module-map.js
│   │   ├── step.js         # layar langkah materi
│   │   ├── practice.js     # latihan + hint + cek ulang
│   │   ├── simulator.js
│   │   ├── test.js         # pretest/posttest
│   │   └── summary.js
│   └── components/
│       ├── fraction.js     # render pecahan
│       ├── hint-panel.js
│       ├── sample-space-table.js  # tabel 6×6 / daftar koin interaktif
│       └── visuals.js      # SVG koin, dadu, bola
├── data/
│   ├── modul-0-pecahan.json
│   ├── modul-1-ruang-sampel.json
│   ├── modul-2-ruang-sampel-dua-benda.json
│   ├── modul-3-peluang-teoretis.json
│   ├── modul-4-peluang-empirik.json
│   ├── modul-5-frekuensi-harapan.json
│   └── tes.json            # 4 soal pre/posttest (instrumen, jangan diubah)
├── apps-script/
│   └── Code.gs             # salinan kode Apps Script (untuk dokumentasi)
├── docs/                   # PRD.md, DESAIN.md, dst. (boleh juga di root)
└── CLAUDE.md
```

## 3. Model data konten

### 3.1 Modul (`data/modul-*.json`)
```json
{
  "id": "modul-2",
  "judul": "Ruang Sampel Dua Benda",
  "tujuan": "Menentukan ruang sampel dua koin dan titik sampel dua dadu.",
  "prasyarat": ["modul-1"],
  "langkah": [
    {
      "tipe": "penjelasan",
      "visual": { "jenis": "koin", "jumlah": 2 },
      "teks": "Koin pertama bisa muncul A atau G. Koin kedua juga bisa A atau G."
    },
    {
      "tipe": "contoh",
      "judul": "Ruang sampel dua koin",
      "tahap": [
        { "teks": "Jika koin pertama A, koin kedua bisa A atau G → AA, AG." },
        { "teks": "Jika koin pertama G, koin kedua bisa A atau G → GA, GG." },
        { "teks": "Jadi S = {AA, AG, GA, GG} dan n(S) = 4." }
      ]
    },
    {
      "tipe": "latihan",
      "id": "m2-l1",
      "soal": "Dua koin dilempar bersamaan. Berapa peluang muncul paling sedikit satu Angka?",
      "visual": { "jenis": "koin", "jumlah": 2 },
      "tahap": [
        {
          "pertanyaan": "Berapa banyak anggota ruang sampel? n(S) =",
          "jawaban": "4",
          "hint": [
            "Tulis dulu semua hasil yang mungkin.",
            "Koin pertama A atau G, koin kedua A atau G.",
            "Contoh: untuk 1 koin dan 1 dadu, hasilnya 2 × 6 = 12."
          ],
          "salahUmum": {
            "3": "Apakah AG dan GA sama? Ingat, koin pertama dan koin kedua berbeda.",
            "2": "Itu ruang sampel satu koin. Di sini ada dua koin."
          }
        },
        {
          "pertanyaan": "Berapa banyak hasil yang memuat paling sedikit satu A?",
          "jawaban": "3",
          "hint": ["Cek satu per satu: AA, AG, GA, GG.", "Mana yang ada huruf A-nya?", "AA, AG, dan GA memuat A."]
        },
        {
          "pertanyaan": "Peluangnya P =",
          "jawaban": "3/4",
          "terimaJuga": ["0,75", "0.75", "6/8"],
          "hint": ["Peluang = n(A) : n(S).", "n(A) = 3, n(S) = 4.", "Tulis sebagai pecahan 3/4."]
        }
      ],
      "cekUlang": "Apakah 3/4 berada di antara 0 dan 1?"
    },
    {
      "tipe": "simulasi",
      "benda": "koin",
      "jumlahBenda": 2,
      "kejadian": "paling-sedikit-satu-A"
    }
  ]
}
```

Tipe langkah: `penjelasan`, `contoh` (worked example, ditampilkan per tahap), `contoh-berlubang` (sebagian tahap diisi siswa), `latihan`, `simulasi`, `ringkasan`.

### 3.2 Pemeriksaan jawaban latihan
- Normalisasi: hapus spasi, ubah koma desimal ke titik.
- Pecahan dianggap benar jika **nilainya sama** dengan kunci (6/8 = 3/4), kecuali tahap meminta "bentuk paling sederhana".
- Jika cocok dengan `salahUmum`, tampilkan pesan khususnya.

## 4. State di localStorage

Kunci: `peluangku_v1`
```json
{
  "siswa": { "kode": "S01", "kelas": "8B", "mulai": "2026-11-20T08:00:00+07:00" },
  "progres": {
    "modul-0": { "selesai": true, "langkahTerakhir": 6, "usahaMental": 3 },
    "modul-1": { "selesai": false, "langkahTerakhir": 2 }
  },
  "latihan": {
    "m2-l1": { "percobaan": 2, "hintDipakai": 1, "benar": true }
  },
  "tes": {
    "pre":  { "jawaban": ["...", "...", "...", "..."], "mulai": "...", "selesai": "...", "terkirim": true },
    "post": null
  }
}
```

## 5. Pengiriman data ke Google Sheets

**Data yang dikirim** (hanya ini):
`kode`, `kelas`, `jenisTes` (pre/post), `jawaban1`–`jawaban4`, `waktuMulai`, `waktuSelesai`, `durasiDetik`, `versiAplikasi`, serta (opsional) ringkasan `hintDipakai` per modul dan `usahaMental` per modul.

Alur:
1. Siswa menekan "Kirim jawaban" → simpan dulu ke localStorage.
2. `api.js` mengirim `POST` (JSON) ke URL Apps Script.
3. Jika berhasil, `terkirim: true`. Jika gagal, tampilkan "Belum terkirim, coba lagi" + tombol **Kirim ulang** + tombol **Salin jawaban** (cadangan).

Apps Script (`apps-script/Code.gs`, garis besar):
```javascript
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActive().getSheetByName(d.jenisTes === 'pre' ? 'Pretest' : 'Posttest');
  sheet.appendRow([new Date(), d.kode, d.kelas, d.jawaban1, d.jawaban2, d.jawaban3, d.jawaban4,
                   d.waktuMulai, d.waktuSelesai, d.durasiDetik, d.versiAplikasi]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
                       .setMimeType(ContentService.MimeType.JSON);
}
```
Deploy sebagai **Web app** (Execute as: Me, Who has access: Anyone). Kirim dari aplikasi dengan `Content-Type: text/plain` agar tidak terkena pemeriksaan CORS preflight.

## 6. Routing (hash)

| Hash | Layar |
|---|---|
| `#/masuk` | Masuk |
| `#/tes/pre/1` … `#/tes/pre/4` | Pretest |
| `#/modul` | Peta modul |
| `#/modul/2/langkah/3` | Langkah ke-3 modul 2 |
| `#/tes/post/1` … | Posttest |
| `#/selesai` | Selesai |

Aturan akses: modul terbuka berurutan; posttest terbuka setelah semua modul selesai; pretest wajib sebelum modul pertama.

## 7. Deploy

1. Push ke GitHub repo.
2. Settings → Pages → Source: branch `main`, folder `/ (root)`.
3. Link: `https://<username>.github.io/<nama-repo>/`. Bagikan ke siswa (bisa dijadikan QR code).
