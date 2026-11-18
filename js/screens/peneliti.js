// Halaman peneliti (tersembunyi, buka manual lewat #/peneliti; tidak ditautkan di aplikasi).
// Untuk melihat status perangkat, menyalin jawaban tes, dan mereset progres
// agar perangkat bisa dipakai siswa berikutnya.
import { bacaState, hapusState } from '../state.js';
import { muatDaftarModul } from '../content.js';
import { teksSalin, salinKeClipboard, sudahDiatur } from '../api.js';
import { esc } from '../dom.js';

const NAMA = { pre: 'Pretest', post: 'Posttest' };

function statusTes(t) {
  if (!t) return 'Belum dikerjakan';
  if (!t.selesai) return 'Sedang dikerjakan (belum dikirim)';
  if (t.terkirim) return 'Selesai, terkirim ke Google Sheets';
  return sudahDiatur() ? 'Selesai, BELUM terkirim' : 'Selesai, tersimpan di perangkat (pengiriman belum diatur)';
}

export async function render(container) {
  const state = bacaState();
  const daftar = await muatDaftarModul().catch(() => []);
  const modulSelesai = daftar.filter((m) => state.progres[m.id]?.selesai).length;
  const adaTes = ['pre', 'post'].filter((j) => state.tes[j]);
  // Jawaban yang hanya ada di perangkat ini dan akan hilang jika direset.
  const berisiko = adaTes.filter((j) => !state.tes[j].terkirim);

  container.innerHTML = `
    <header class="screen-head">
      <h1>Halaman peneliti</h1>
      <p>Hanya untuk peneliti. Jangan tunjukkan ke siswa.</p>
    </header>

    <section class="panel-peneliti" aria-labelledby="h-status">
      <h2 id="h-status">Perangkat ini</h2>
      <dl class="daftar-info">
        <dt>Siswa</dt><dd>${state.siswa ? `${esc(state.siswa.kode)} · kelas ${esc(state.siswa.kelas)}` : 'Belum ada siswa masuk'}</dd>
        <dt>Pretest</dt><dd>${statusTes(state.tes.pre)}</dd>
        <dt>Modul selesai</dt><dd>${modulSelesai} dari ${daftar.length}</dd>
        <dt>Posttest</dt><dd>${statusTes(state.tes.post)}</dd>
      </dl>
      ${adaTes
        .map((j) => `<button type="button" class="btn btn-secondary btn-block" data-salin="${j}">Salin jawaban ${NAMA[j]}</button>`)
        .join('')}
      <p class="field-hint" data-salin-info aria-live="polite"></p>
    </section>

    <section class="panel-peneliti" aria-labelledby="h-reset">
      <h2 id="h-reset">Reset progres</h2>
      <p>Menghapus kode siswa, progres modul, dan jawaban tes <strong>di perangkat ini saja</strong>. Data yang sudah terkirim ke Google Sheets tidak terhapus.</p>
      ${berisiko.length
        ? `<p class="notice notice-warn" role="alert">Jawaban ${berisiko.map((j) => NAMA[j]).join(' dan ')} siswa ini belum terkirim ke Google Sheets dan akan hilang. Salin dulu dengan tombol di atas.</p>`
        : ''}
      <form class="form" data-form-reset novalidate>
        <div class="field">
          <label for="konfirmasi-reset">Ketik RESET untuk konfirmasi</label>
          <input id="konfirmasi-reset" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="reset-err">
          <span id="reset-err" class="field-error" role="alert"></span>
        </div>
        <button type="submit" class="btn btn-bahaya btn-block">Reset progres</button>
      </form>
    </section>

    <a class="btn btn-secondary btn-block" href="#/masuk">Kembali ke aplikasi</a>
  `;

  container.querySelectorAll('[data-salin]').forEach((tombol) => {
    tombol.addEventListener('click', async () => {
      const ok = await salinKeClipboard(teksSalin(bacaState(), tombol.dataset.salin));
      container.querySelector('[data-salin-info]').textContent = ok
        ? `Jawaban ${NAMA[tombol.dataset.salin]} sudah disalin.`
        : 'Gagal menyalin. Coba browser lain.';
    });
  });

  const form = container.querySelector('[data-form-reset]');
  const input = form.querySelector('input');
  const galat = form.querySelector('#reset-err');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim().toUpperCase() !== 'RESET') {
      galat.textContent = 'Ketik RESET (huruf besar) untuk melanjutkan.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    hapusState();
    location.hash = '#/masuk';
  });
}
