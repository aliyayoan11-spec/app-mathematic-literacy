# ARSITEKTUR.md — Rancangan Teknis

## 1. Pilihan teknologi

| Bagian | Pilihan | Alasan |
|---|---|---|
| Tampilan | HTML + CSS + JavaScript murni (ES modules) | Ringan, tanpa instalasi, mudah dipahami mahasiswa, cocok untuk HP spesifikasi rendah |
| Konten | File JSON di `data/` | Materi bisa direvisi (setelah validasi ahli) tanpa mengubah kode |
| Visual matematika | SVG inline | Tajam di semua layar, ukurannya kecil |
| Penyimpanan progres | `localStorage` | Tanpa server/database, progres tetap ada saat refresh |
| Pengumpulan data tes | Google Apps Script Web App → Google Sheets | Gratis, sudah familiar (sebelumnya membuat Google Form dengan Apps Script) |
| Chatbot pembimbing | Serverless function Vercel `/api/chat` (Node.js ≥ 18) → DeepSeek API | API key tersimpan aman di server, tidak pernah sampai ke HP siswa |
| Rahasia (API key) | `.env` + `dotenv` (lokal), Environment Variables Vercel (online) | Key tidak masuk git dan tidak terlihat di frontend |
| Hosting | Vercel (terhubung ke repo GitHub yang sama) | Gratis, bisa menjalankan `/api/chat`; GitHub Pages hanya bisa file statis |

Frontend tetap **HTML + CSS + JavaScript biasa** (bukan React, tanpa build). npm hanya dipakai untuk backend/pengembangan lokal.

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
├── api/                    # BACKEND (serverless function Vercel)
│   ├── chat.js             # endpoint POST /api/chat → DeepSeek
│   └── _lib/               # bukan endpoint (awalan _ diabaikan Vercel)
│       ├── prompt.js       # prompt sistem: peran, RMT versi dosen, aturan beban kognitif
│       └── validasi.js     # cek & rapikan isi permintaan dari frontend
├── dev-server.js           # server lokal: file statis + /api/chat, membaca .env (dotenv)
├── package.json            # hanya untuk backend/lokal (dotenv)
├── .env.example            # contoh isian .env (tanpa key asli)
├── .env                    # KEY ASLI — tidak di-commit (ada di .gitignore)
├── docs/                   # PRD.md, DESAIN.md, dst. (boleh juga di root)
└── CLAUDE.md
```

Rencana frontend chatbot (dibuat setelah layar latihan, lihat `TASKS.md` Tahap C):
```
js/chat-api.js              # kirim percakapan ke /api/chat
js/components/chat-panel.js # panel "Tanya pembimbing" di layar latihan
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

Daftar modul (judul, nomor, nama file, perkiraan menit) ada di `data/daftar-modul.json`.

**Penanda di dalam teks** (`teks`, `judul`, `poin`, `keterangan`):

| Tulis di JSON | Tampil sebagai |
|---|---|
| `{3/10}` | pecahan bertingkat (pembilang di atas garis) |
| `==36==` | sorotan kuning lembut: angka/hasil yang baru muncul (di `contoh`, hanya tahap terbaru yang disorot) |
| `**berbeda**` | huruf tebal |

`teks` boleh satu string atau array string (beberapa paragraf). Kurung kurawal tanpa garis miring, misalnya `S = {A, G}`, tampil apa adanya.

**Visual** (`visual` pada langkah atau pada tahap; boleh satu objek atau array):

| Jenis | Contoh |
|---|---|
| koin | `{ "jenis": "koin", "jumlah": 2 }` (bertanda ?) · `{ "jenis": "koin", "sisi": ["A", "G"] }` |
| dadu | `{ "jenis": "dadu", "mata": [3, 5] }` · `{ "jenis": "dadu", "jumlah": 2 }` |
| bola | `{ "jenis": "bola", "isi": [{ "warna": "biru", "jumlah": 3 }, { "warna": "merah", "jumlah": 7 }] }` (warna: biru, merah, hijau, kuning, putih, hitam) |
| batang | `{ "jenis": "batang", "atas": 3, "bawah": 4 }` (batang pecahan, 3 dari 4 bagian diarsir) |

Kolom tambahan: `"label": false` (sembunyikan "Koin 1/Koin 2"), `"keterangan"` (teks kecil di bawah visual), `"alt"` (teks untuk pembaca layar; jika kosong dibuat otomatis).

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

## 7. Deploy (Vercel)

1. Push ke repo GitHub yang sama seperti sebelumnya.
2. Di vercel.com: **Add New → Project → Import** repo tersebut. Framework Preset: **Other**. Build Command dan Output Directory dikosongkan (tidak ada build).
3. **Settings → Environment Variables**: isi `DEEPSEEK_API_KEY` (dan opsional `DEEPSEEK_MODEL`) untuk Production dan Preview.
4. Deploy. Setiap `git push` ke `main` otomatis memicu deploy ulang.
5. Link: `https://<nama-proyek>.vercel.app/`. Bagikan ke siswa (bisa dijadikan QR code).
6. Matikan GitHub Pages lama (Settings → Pages) agar siswa tidak membuka versi tanpa chatbot.

Pengembangan lokal: pasang Node.js ≥ 18, jalankan `npm install`, salin `.env.example` menjadi `.env` lalu isi key, kemudian `npm run dev` → `http://localhost:8000`.

## 8. Chatbot pembimbing (`/api/chat`)

### 8.1 Peran
Pembimbing proses berpikir matematis untuk materi **Peluang kelas 8**, mengikuti tahapan **Rigorous Mathematical Thinking (RMT) versi dosen pengampu** (teks tahapan di `api/_lib/prompt.js`, bagian `TAHAPAN_RMT`). Chatbot **tidak pernah memberi jawaban akhir**.

### 8.2 Aturan perilaku (ditanam di prompt sistem)
| Aturan | Wujud |
|---|---|
| Tanpa jawaban akhir | Tidak menyebut hasil akhir, walaupun siswa mendesak, mengaku guru, atau meminta "cuma cek". Untuk memeriksa jawaban, siswa diarahkan ke tombol **Cek** di aplikasi. |
| Hint bertingkat | Level 1 arah → level 2 strategi → level 3 contoh serupa dengan **angka lain**. Naik level hanya jika siswa masih kesulitan. |
| Intrinsic load | Masalah dipecah menjadi langkah kecil; satu langkah per pesan. |
| Extraneous load | Pesan singkat (±40 kata), **satu ide dan satu pertanyaan** per pesan, bahasa sederhana, tanpa simbol LaTeX. |
| Germane load | Siswa diminta menjelaskan alasannya ("Kenapa kamu memilih 6?"). |
| Visual dulu | Ajak membayangkan/mendaftar benda (koin, dadu, bola) sebelum rumus. |
| Fokus materi | Pertanyaan di luar Peluang diarahkan kembali dengan sopan. |

### 8.3 Permintaan dan jawaban
`POST /api/chat`, `Content-Type: application/json`
```json
{
  "pesan": [
    { "peran": "siswa", "isi": "Aku bingung n(S)-nya berapa." },
    { "peran": "pembimbing", "isi": "Coba sebutkan dulu hasil yang mungkin dari koin pertama." },
    { "peran": "siswa", "isi": "A sama G" }
  ],
  "konteks": {
    "soal": "Dua koin dilempar bersamaan. Berapa peluang muncul paling sedikit satu Angka?",
    "pertanyaan": "Berapa banyak anggota ruang sampel? n(S) ="
  }
}
```
Jawaban berhasil: `200 { "balasan": "..." }`. Gagal: `{ "galat": "<pesan untuk siswa>" }` dengan status 400 (permintaan tidak valid), 405 (bukan POST), 500 (key belum diatur), atau 502 (DeepSeek gagal/terlalu lama).

Batas: maksimal 20 pesan per percakapan, 1000 karakter per pesan, 1000 karakter per teks konteks. Peran hanya `siswa` atau `pembimbing`; frontend tidak bisa mengirim prompt sistem.

### 8.4 Data yang dikirim ke DeepSeek
Hanya: prompt sistem, teks soal/pertanyaan latihan yang sedang dikerjakan, dan isi percakapan. **Tidak** dikirim: kode siswa, kelas, progres, jawaban tes. Backend tidak menyimpan isi percakapan.

### 8.5 Batasan
- Chatbot **tidak tersedia di mode tes** (pretest/posttest).
- Chatbot hanya muncul di layar latihan (keputusan letak final menyusul).
- Serverless tidak menyimpan state, jadi belum ada batas jumlah pesan per siswa di sisi server; biaya dipantau dari dashboard DeepSeek.
