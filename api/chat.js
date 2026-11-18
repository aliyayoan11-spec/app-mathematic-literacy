// Serverless function Vercel: POST /api/chat
// Menerima percakapan dari frontend, menambahkan prompt sistem, lalu meneruskan ke DeepSeek.
// API key dibaca dari process.env.DEEPSEEK_API_KEY:
//   - lokal  : file .env (dimuat oleh dev-server.js lewat dotenv)
//   - online : Vercel → Settings → Environment Variables
// Isi percakapan tidak disimpan dan tidak dicatat di log.
import { validasiPermintaan } from './_lib/validasi.js';
import { buatPromptSistem } from './_lib/prompt.js';

const URL_DEEPSEEK = 'https://api.deepseek.com/chat/completions';
const MODEL_BAWAAN = 'deepseek-chat';
const BATAS_WAKTU_MS = 25000;
const BATAS_BODY_BYTE = 64 * 1024;

const GALAT_SIBUK = 'Pembimbing sedang tidak bisa dihubungi. Coba lagi sebentar lagi.';

function kirim(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return kirim(res, 405, { galat: 'Gunakan metode POST.' });
  }

  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    console.error('DEEPSEEK_API_KEY belum diatur (.env atau Environment Variables Vercel).');
    return kirim(res, 500, { galat: 'Pembimbing belum siap. Beri tahu guru atau peneliti.' });
  }

  let body;
  try {
    body = await bacaBody(req);
  } catch {
    return kirim(res, 400, { galat: 'Permintaan tidak bisa dibaca.' });
  }

  const cek = validasiPermintaan(body);
  if (!cek.ok) return kirim(res, 400, { galat: cek.galat });

  const pengendali = new AbortController();
  const penghitungWaktu = setTimeout(() => pengendali.abort(), BATAS_WAKTU_MS);

  try {
    const jawab = await fetch(URL_DEEPSEEK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || MODEL_BAWAAN,
        messages: [{ role: 'system', content: buatPromptSistem(cek.konteks) }, ...cek.pesan],
        temperature: 0.3,
        max_tokens: 250, // pesan pendek = beban kognitif rendah
        stream: false,
      }),
      signal: pengendali.signal,
    });

    if (!jawab.ok) {
      console.error('DeepSeek menolak permintaan, status', jawab.status);
      return kirim(res, 502, { galat: GALAT_SIBUK });
    }

    const data = await jawab.json();
    const balasan = data?.choices?.[0]?.message?.content?.trim();
    if (!balasan) {
      console.error('DeepSeek mengembalikan balasan kosong.');
      return kirim(res, 502, { galat: GALAT_SIBUK });
    }
    return kirim(res, 200, { balasan });
  } catch (e) {
    console.error('Gagal menghubungi DeepSeek:', e.name === 'AbortError' ? 'batas waktu habis' : e.message);
    return kirim(res, 502, { galat: GALAT_SIBUK });
  } finally {
    clearTimeout(penghitungWaktu);
  }
}
