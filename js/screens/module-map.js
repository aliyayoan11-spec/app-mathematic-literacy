// Layar Peta Modul: pretest → modul 0–5 → posttest, dengan status masing-masing.
import { bacaState } from '../state.js';
import { muatDaftarModul } from '../content.js';
import { statusPretest, statusModul, statusPosttest } from '../akses.js';
import { esc } from '../dom.js';

const IKON = { selesai: '✓', sedang: '●', terkunci: '○' };

function item({ href, status, judul, keterangan }) {
  const isi = `
    <span class="map-icon" aria-hidden="true">${IKON[status]}</span>
    <span class="map-body">
      <span class="map-title">${esc(judul)}</span>
      <span class="map-meta">${esc(keterangan)}</span>
    </span>`;
  // Item terkunci tidak bisa diketuk; item lain berupa tautan.
  if (status === 'terkunci') {
    return `<li><div class="map-item" data-status="terkunci" aria-disabled="true">${isi}</div></li>`;
  }
  const kini = status === 'sedang' ? ' aria-current="step"' : '';
  return `<li><a class="map-item" data-status="${status}" href="${href}"${kini}>${isi}</a></li>`;
}

function keteranganModul(status, modul) {
  if (status === 'selesai') return 'Selesai · ketuk untuk mengulang';
  if (status === 'sedang') return `Kerjakan sekarang · ±${modul.perkiraanMenit} menit`;
  return 'Terkunci';
}

export async function render(container) {
  const state = bacaState();
  const { kode, kelas } = state.siswa;

  let daftar;
  try {
    daftar = await muatDaftarModul();
  } catch (e) {
    console.error(e);
    container.innerHTML = `
      <div class="notice">
        <h1>Peta modul</h1>
        <p class="notice-error">Daftar modul gagal dimuat. Periksa koneksi internet, lalu coba lagi.</p>
        <button type="button" class="btn btn-primary btn-block" data-ulang>Coba lagi</button>
      </div>`;
    container.querySelector('[data-ulang]').addEventListener('click', () => render(container));
    return;
  }

  const sPre = statusPretest(state);
  const sModul = statusModul(daftar, state);
  const sPost = statusPosttest(daftar, state);

  const itemPre = item({
    href: '#/tes/pre/1',
    status: sPre,
    judul: 'Pretest',
    keterangan: sPre === 'selesai' ? 'Selesai' : 'Kerjakan dulu sebelum modul · 4 soal',
  });

  const itemModul = daftar
    .map((m) => {
      const status = sModul[m.id];
      const langkah = state.progres[m.id]?.langkahTerakhir || 1;
      return item({
        href: `#/modul/${m.nomor}/langkah/${langkah}`,
        status,
        judul: `Modul ${m.nomor} · ${m.judul}`,
        keterangan: keteranganModul(status, m),
      });
    })
    .join('');

  const itemPost = item({
    href: '#/tes/post/1',
    status: sPost,
    judul: 'Posttest',
    keterangan:
      sPost === 'selesai' ? 'Selesai'
        : sPost === 'sedang' ? 'Kerjakan sekarang · 4 soal'
          : 'Terkunci · selesaikan semua modul',
  });

  container.innerHTML = `
    <header class="screen-head">
      <h1>Halo, ${esc(kode)}</h1>
      <p>Kelas ${esc(kelas)} · Kerjakan berurutan dari atas.</p>
    </header>
    <nav aria-label="Peta modul">
      <ul class="map-list">${itemPre}</ul>
      <div class="map-divider" role="presentation"></div>
      <ul class="map-list">${itemModul}</ul>
      <div class="map-divider" role="presentation"></div>
      <ul class="map-list">${itemPost}</ul>
    </nav>
  `;
}
