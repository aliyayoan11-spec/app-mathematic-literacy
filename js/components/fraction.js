// Komponen pecahan: pembilang di atas garis, penyebut di bawah.
// Pembaca layar membaca "3 per 10".
import { esc } from '../dom.js';

export function pecahanHTML(atas, bawah) {
  const a = String(atas).trim();
  const b = String(bawah).trim();
  return (
    `<span class="frac">` +
    `<span class="sr-only">${esc(a)} per ${esc(b)}</span>` +
    `<span class="frac-num" aria-hidden="true">${esc(a)}</span>` +
    `<span class="frac-den" aria-hidden="true">${esc(b)}</span>` +
    `</span>`
  );
}
