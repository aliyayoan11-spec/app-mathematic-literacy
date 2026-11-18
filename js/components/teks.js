// Mengubah teks konten (dari data/*.json) menjadi HTML yang aman.
// Penanda yang dikenali:
//   {3/10}      → pecahan bertingkat (komponen pecahan)
//   ==4==       → sorotan angka/hasil yang baru muncul
//   **kata**    → huruf tebal
// Tanda kurung kurawal tanpa garis miring, mis. S = {A, G}, tetap tampil apa adanya.
import { esc } from '../dom.js';
import { pecahanHTML } from './fraction.js';

const POLA = /\{([^{}/]+)\/([^{}]+)\}|==(.+?)==|\*\*(.+?)\*\*/g;

export function teksBarisHTML(teks) {
  const s = String(teks ?? '');
  let hasil = '';
  let posisi = 0;
  for (const m of s.matchAll(POLA)) {
    hasil += esc(s.slice(posisi, m.index));
    if (m[1] !== undefined) hasil += pecahanHTML(m[1], m[2]);
    else if (m[3] !== undefined) hasil += `<mark class="sorot">${teksBarisHTML(m[3])}</mark>`;
    else hasil += `<strong>${teksBarisHTML(m[4])}</strong>`;
    posisi = m.index + m[0].length;
  }
  return hasil + esc(s.slice(posisi));
}

// teks boleh string (satu paragraf) atau array string (beberapa paragraf).
export function teksHTML(teks) {
  if (teks == null) return '';
  const paragraf = Array.isArray(teks) ? teks : [teks];
  return paragraf.map((p) => `<p>${teksBarisHTML(p)}</p>`).join('');
}
