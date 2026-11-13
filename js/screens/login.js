// Layar Masuk: kode siswa + kelas (tanpa nama lengkap, tanpa password).
import { simpanSiswa } from '../state.js';
import { ruteAwal } from '../akses.js';

// Hapus spasi dan jadikan huruf besar: " s01 " → "S01", "8 b" → "8B".
function rapikanIsian(teks) {
  return teks.replace(/\s+/g, '').toUpperCase();
}

export function render(container) {
  container.innerHTML = `
    <header class="screen-head">
      <h1 class="app-name">PeluangKu</h1>
      <p>Belajar peluang langkah demi langkah.</p>
    </header>

    <form class="form" novalidate>
      <div class="field">
        <label for="kode">Kode siswa</label>
        <input id="kode" name="kode" type="text" inputmode="text" autocomplete="off"
               autocapitalize="characters" spellcheck="false" maxlength="10"
               aria-describedby="kode-ket kode-err">
        <span id="kode-ket" class="field-hint">Contoh: S01</span>
        <span id="kode-err" class="field-error" role="alert"></span>
      </div>

      <div class="field">
        <label for="kelas">Kelas</label>
        <input id="kelas" name="kelas" type="text" autocomplete="off"
               autocapitalize="characters" spellcheck="false" maxlength="10"
               aria-describedby="kelas-ket kelas-err">
        <span id="kelas-ket" class="field-hint">Contoh: 8B</span>
        <span id="kelas-err" class="field-error" role="alert"></span>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Mulai</button>
    </form>
  `;

  const form = container.querySelector('form');
  const isian = {
    kode: { input: form.kode, err: container.querySelector('#kode-err'), pesan: 'Kode siswa belum diisi.' },
    kelas: { input: form.kelas, err: container.querySelector('#kelas-err'), pesan: 'Kelas belum diisi.' },
  };

  function tandai(f, salah) {
    f.input.setAttribute('aria-invalid', salah ? 'true' : 'false');
    f.err.textContent = salah ? f.pesan : '';
  }

  // Hapus pesan galat begitu siswa mulai mengetik.
  for (const f of Object.values(isian)) {
    f.input.addEventListener('input', () => {
      if (rapikanIsian(f.input.value)) tandai(f, false);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const kode = rapikanIsian(isian.kode.input.value);
    const kelas = rapikanIsian(isian.kelas.input.value);

    tandai(isian.kode, !kode);
    tandai(isian.kelas, !kelas);

    if (!kode) return isian.kode.input.focus();
    if (!kelas) return isian.kelas.input.focus();

    const state = simpanSiswa(kode, kelas);
    location.hash = ruteAwal(state);
  });
}
