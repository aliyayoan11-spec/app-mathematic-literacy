// Serverless function Vercel: POST /api/chat
// Menerima percakapan dari frontend, menambahkan prompt sistem (RMT + beban kognitif),
// lalu meneruskan ke DeepSeek.
// API key dibaca dari process.env.DEEPSEEK_API_KEY:
//   - lokal  : file .env (dimuat oleh dev-server.js lewat dotenv)
//   - online : Vercel → Settings → Environment Variables
// Isi percakapan tidak disimpan dan tidak dicatat di log.
//
// Jawaban:
//   berhasil → 200 { "balasan": "..." }
//   gagal    → 4xx/5xx { "galat": "<pesan untuk siswa>", "kode": "<KODE_GALAT>" }
//   Daftar kode: api/_lib/galat.js
import { validasiPermintaan } from './_lib/validasi.js';
import { buatPromptSistem } from './_lib/prompt.js';
import { GALAT, kodeDariStatusDeepSeek } from './_lib/galat.js';

const URL_DEEPSEEK = 'https://api.deepseek.com/chat/completions';
const MODEL_BAWAAN = 'deepseek-chat';
const BATAS_WAKTU_MS = 25000;
const BATAS_BODY_BYTE = 64 * 1024;

function kirim(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

// Kirim galat ke siswa + tulis petunjuk teknis ke log pengembang.
function gagal(res, kode, { pesanSiswa, detail } = {}) {
  const g = GALAT[kode];
  console.error(`[api/chat] ${kode}: ${g.log}${detail ? ` | ${detail}` : ''}`);
  return kirim(res, g.status, { galat: pesanSiswa ?? g.siswa, kode });
}

// Vercel sudah mengurai body JSON ke req.body; server lokal belum, jadi dibaca manual.
async function bacaBody(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  let teks = '';
  for await (const potongan of req) {
    teks += potongan;
    if (teks.length > BATAS_BODY_BYTE) throw new Error('Body terlalu besar');
  }
  return JSON.parse(teks || 'null');
}

// Ambil pesan galat dari DeepSeek untuk log (dipotong; tidak memuat API key).
async function ringkasGalatDeepSeek(jawab) {
  try {
    const teks = await jawab.text();
    let pesan = teks;
    try {
      pesan = JSON.parse(teks)?.error?.message ?? teks;
    } catch {
      // bukan JSON, pakai teks mentah
    }
    return `status ${jawab.status}: ${String(pesan).slice(0, 200)}`;
  } catch {
    return `status ${jawab.status}`;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return gagal(res, 'METODE_SALAH');
  }

  const key = process.env.DEEPSEEK_API_KEY?.trim();
  if (!key) return gagal(res, 'KEY_BELUM_DIATUR');

  let body;
  try {
    body = await bacaBody(req);
  } catch {
    return gagal(res, 'PERMINTAAN_TIDAK_VALID', { detail: 'body bukan JSON yang valid' });
  }

  const cek = validasiPermintaan(body);
  if (!cek.ok) return gagal(res, 'PERMINTAAN_TIDAK_VALID', { pesanSiswa: cek.galat, detail: cek.galat });

  const pengendali = new AbortController();
  const penghitungWaktu = setTimeout(() => pengendali.abort(), BATAS_WAKTU_MS);

  let jawab;
  try {
    jawab = await fetch(URL_DEEPSEEK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL?.trim() || MODEL_BAWAAN,
        messages: [{ role: 'system', content: buatPromptSistem(cek.konteks) }, ...cek.pesan],
        temperature: 0.3,
        max_tokens: 250, // pesan pendek = beban kognitif rendah
        stream: false,
      }),
      signal: pengendali.signal,
    });
  } catch (e) {
    clearTimeout(penghitungWaktu);
    if (e.name === 'AbortError') return gagal(res, 'WAKTU_HABIS', { detail: `> ${BATAS_WAKTU_MS / 1000} detik` });
    return gagal(res, 'TIDAK_TERHUBUNG', { detail: e.cause?.code ?? e.message });
  }

  try {
    if (!jawab.ok) {
      return gagal(res, kodeDariStatusDeepSeek(jawab.status), { detail: await ringkasGalatDeepSeek(jawab) });
    }

    let data;
    try {
      data = await jawab.json();
    } catch {
      return gagal(res, 'BALASAN_KOSONG', { detail: 'balasan bukan JSON' });
    }
    const balasan = data?.choices?.[0]?.message?.content?.trim();
    if (!balasan) return gagal(res, 'BALASAN_KOSONG', { detail: `finish_reason=${data?.choices?.[0]?.finish_reason}` });

    return kirim(res, 200, { balasan });
  } catch (e) {
    if (e.name === 'AbortError') return gagal(res, 'WAKTU_HABIS', { detail: 'saat membaca balasan' });
    return gagal(res, 'TIDAK_TERHUBUNG', { detail: e.message });
  } finally {
    clearTimeout(penghitungWaktu);
  }
}
