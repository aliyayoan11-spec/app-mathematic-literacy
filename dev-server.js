// Server lokal untuk pengembangan: `npm run dev` → http://localhost:8000
// - Membaca .env lewat dotenv (DEEPSEEK_API_KEY, dll.)
// - POST /api/chat dijalankan dengan handler yang sama seperti di Vercel
// - File lain disajikan sebagai file statis
// Di Vercel file ini tidak dipakai.
import 'dotenv/config';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chatHandler from './api/chat.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
};

// Jangan pernah menyajikan rahasia atau kode backend sebagai file statis.
function dilarang(bagian) {
  return bagian.some((b) => b.startsWith('.')) || ['api', 'node_modules'].includes(bagian[0]);
}

async function sajikanFile(req, res, pathname) {
  let relatif;
  try {
    relatif = decodeURIComponent(pathname).replace(/^\/+/, '');
  } catch {
    res.writeHead(400).end('Alamat tidak valid');
    return;
  }
  const bagian = relatif.split(/[\\/]+/).filter(Boolean);
  let file = path.resolve(ROOT, ...bagian);

  if (dilarang(bagian) || (file !== ROOT && !file.startsWith(ROOT + path.sep))) {
    res.writeHead(404).end('Tidak ditemukan');
    return;
  }

  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const isi = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(req.method === 'HEAD' ? undefined : isi);
  } catch {
    res.writeHead(404).end('Tidak ditemukan');
  }
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (pathname === '/api/chat') {
    try {
      await chatHandler(req, res);
    } catch (e) {
      console.error(e);
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ galat: 'Terjadi kesalahan di server lokal.' }));
    }
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }
  await sajikanFile(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`PeluangKu berjalan di http://localhost:${PORT}`);
  if (!process.env.DEEPSEEK_API_KEY) {
    console.warn('Peringatan: DEEPSEEK_API_KEY kosong. Salin .env.example menjadi .env lalu isi key-nya.');
  }
});
