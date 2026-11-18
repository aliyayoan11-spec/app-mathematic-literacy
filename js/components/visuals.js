// Visual matematika sederhana dalam SVG: koin, dadu, bola dalam kotak, batang pecahan.
// Spesifikasi visual berasal dari data JSON, contoh:
//   { "jenis": "koin", "jumlah": 2 }                 → 2 koin bertanda "?"
//   { "jenis": "koin", "sisi": ["A", "G"] }          → koin A dan koin G
//   { "jenis": "dadu", "mata": [3, 5] }              → dadu bermata 3 dan 5
//   { "jenis": "dadu", "mata": [1,2,3,4,5,6], "label": false }
//   { "jenis": "bola", "isi": [{ "warna": "biru", "jumlah": 3 }, { "warna": "merah", "jumlah": 7 }] }
//   { "jenis": "batang", "atas": 3, "bawah": 4 }     → batang 4 bagian, 3 diarsir
// Kolom opsional: "label" (array teks / false), "keterangan" (teks di bawah), "alt" (teks pembaca layar).
// "visual" di JSON boleh satu objek atau array objek (ditampilkan berjajar).
import { esc } from '../dom.js';
import { teksBarisHTML } from './teks.js';

const UKURAN = 56;

// ---------- Koin ----------
function svgKoin(sisi) {
  const huruf = sisi ?? '?';
  return `
    <svg class="vis-svg" width="${UKURAN}" height="${UKURAN}" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <circle cx="28" cy="28" r="25" class="vis-koin"/>
      <circle cx="28" cy="28" r="19" class="vis-garis-tipis"/>
      <text x="28" y="29" class="vis-huruf">${esc(huruf)}</text>
    </svg>`;
}

// ---------- Dadu ----------
const P = { tl: [16, 16], tr: [40, 16], ml: [16, 28], mr: [40, 28], bl: [16, 40], br: [40, 40], c: [28, 28] };
const MATA = {
  1: ['c'],
  2: ['tl', 'br'],
  3: ['tl', 'c', 'br'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'c', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
};

function svgDadu(mata) {
  const titik = MATA[mata];
  const isi = titik
    ? titik.map((k) => `<circle cx="${P[k][0]}" cy="${P[k][1]}" r="4.5" class="vis-titik"/>`).join('')
    : `<text x="28" y="29" class="vis-huruf">?</text>`;
  return `
    <svg class="vis-svg" width="${UKURAN}" height="${UKURAN}" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="48" height="48" rx="8" class="vis-dadu"/>
      ${isi}
    </svg>`;
}

// Koin & dadu memakai pola yang sama: beberapa benda berjajar + label.
function bendaBerjajar(v, nama, svg, nilai) {
  const daftar = nilai ?? Array.from({ length: v.jumlah ?? 1 }, () => null);
  const label = Array.isArray(v.label)
    ? v.label
    : v.label !== false && daftar.length > 1
      ? daftar.map((_, i) => `${nama} ${i + 1}`)
      : [];
  const item = daftar
    .map((n, i) => `
      <div class="vis-item">
        ${svg(n)}
        ${label[i] ? `<span class="vis-label">${esc(label[i])}</span>` : ''}
      </div>`)
    .join('');
  const ket = nilai ? `: ${nilai.join(', ')}` : '';
  return {
    html: `<div class="vis-group">${item}</div>`,
    alt: `${daftar.length} ${nama.toLowerCase()}${ket}`,
  };
}

// ---------- Bola dalam kotak ----------
const WARNA_BOLA = ['biru', 'merah', 'hijau', 'kuning', 'putih', 'hitam'];

function warnaBola(warna) {
  return WARNA_BOLA.includes(warna) ? `var(--bola-${warna})` : 'var(--muted)';
}

function bola(v) {
  const isi = v.isi ?? [];
  const semua = isi.flatMap((k) => Array.from({ length: k.jumlah }, () => k.warna));
  const kolom = Math.min(Math.max(semua.length, 1), 5);
  const baris = Math.max(Math.ceil(semua.length / 5), 1);
  const jarak = 32;
  const lebar = kolom * jarak + 16;
  const tinggi = baris * jarak + 16;
  const lingkaran = semua
    .map((w, i) => {
      const x = 8 + (i % 5) * jarak + jarak / 2;
      const y = 8 + Math.floor(i / 5) * jarak + jarak / 2;
      return `<circle cx="${x}" cy="${y}" r="12" class="vis-bola" style="fill:${warnaBola(w)}"/>`;
    })
    .join('');
  const legenda = isi
    .map((k) => `<span class="vis-legend-item"><span class="vis-dot" style="background:${warnaBola(k.warna)}"></span>${esc(k.jumlah)} ${esc(k.warna)}</span>`)
    .join('');
  return {
    html: `
      <div class="vis-item">
        <svg class="vis-svg" width="${lebar}" height="${tinggi}" viewBox="0 0 ${lebar} ${tinggi}" aria-hidden="true" focusable="false">
          <rect x="1" y="1" width="${lebar - 2}" height="${tinggi - 2}" rx="8" class="vis-kotak"/>
          ${lingkaran}
        </svg>
        <span class="vis-legend">${legenda}</span>
      </div>`,
    alt: `Kotak berisi ${isi.map((k) => `${k.jumlah} bola ${k.warna}`).join(' dan ')}`,
  };
}

// ---------- Batang pecahan ----------
function batang(v) {
  const bawah = Math.max(1, Math.min(Number(v.bawah) || 1, 24));
  const atas = Math.max(0, Math.min(Number(v.atas) || 0, bawah));
  const lebarBagian = Math.min(48, Math.floor(288 / bawah));
  const lebar = lebarBagian * bawah + 4;
  const kotak = Array.from({ length: bawah }, (_, i) =>
    `<rect x="${2 + i * lebarBagian}" y="2" width="${lebarBagian}" height="36" class="${i < atas ? 'vis-arsir' : 'vis-kosong'}"/>`,
  ).join('');
  return {
    html: `
      <div class="vis-item">
        <svg class="vis-svg" width="${lebar}" height="40" viewBox="0 0 ${lebar} 40" aria-hidden="true" focusable="false">${kotak}</svg>
      </div>`,
    alt: `Batang dibagi ${bawah} bagian sama besar, ${atas} bagian diarsir`,
  };
}

// ---------- Pemilih ----------
function satuVisual(v) {
  switch (v?.jenis) {
    case 'koin':
      return bendaBerjajar(v, 'Koin', svgKoin, v.sisi);
    case 'dadu':
      return bendaBerjajar(v, 'Dadu', svgDadu, v.mata);
    case 'bola':
      return bola(v);
    case 'batang':
      return batang(v);
    default:
      console.warn('Jenis visual tidak dikenal:', v);
      return null;
  }
}

export function visualHTML(spek) {
  if (!spek) return '';
  const daftar = (Array.isArray(spek) ? spek : [spek])
    .map((v) => {
      const r = satuVisual(v);
      if (!r) return null;
      const ket = v.keterangan ? `<p class="vis-caption">${teksBarisHTML(v.keterangan)}</p>` : '';
      return { html: `<div class="vis-block">${r.html}${ket}</div>`, alt: v.alt ?? r.alt };
    })
    .filter(Boolean);
  if (!daftar.length) return '';
  const alt = daftar.map((d) => d.alt).join('; ');
  return `
    <figure class="visual" role="img" aria-label="${esc(alt)}">
      ${daftar.map((d) => d.html).join('')}
    </figure>`;
}
