// Layar Tes (pretest/posttest): 4 soal uraian, satu soal per layar.
// Mode tes MURNI: tanpa hint, tanpa umpan balik benar/salah, tanpa chatbot, tanpa timer.
// Jawaban tersimpan otomatis di localStorage setiap kali siswa mengetik.
import { bacaState, ubahState } from '../state.js';
import { muatTes, muatDaftarModul } from '../content.js';
import { teksHTML, teksBarisHTML } from '../components/teks.js';
import { esc, fokusJudul } from '../dom.js';
import { kirimHasilTes, sudahDiatur, teksSalin, salinKeClipboard } from '../api.js';

const NAMA = { pre: 'Pretest', post: 'Posttest' };
const JUMLAH_SOAL = 4;

function pastikanMulai(jenis) {
  ubahState((s) => {
    if (!s.tes[jenis]) {
      s.tes[jenis] = {
        jawaban: Array(JUMLAH_SOAL).fill(''),
        mulai: new Date().toISOString(),
        selesai: null,
        durasiDetik: null,
        terkirim: false,
      };
    }
  });
}

function tabelHTML(tabel) {
  if (!tabel?.kepala || !tabel?.baris) return '';
  const kepala = tabel.kepala.map((k) => `<th scope="col">${teksBarisHTML(k)}</th>`).join('');
  const baris = tabel.baris
    .map((b) => `<tr>${b.map((sel) => `<td>${teksBarisHTML(sel)}</td>`).join('')}</tr>`)
    .join('');
  return `<div class="tabel-wrap"><table class="tabel-soal"><thead><tr>${kepala}</tr></thead><tbody>${baris}</tbody></table></div>`;
}

function layarGagal(container, jenis) {
  container.innerHTML = `
    <div class="notice">
      <h1>${NAMA[jenis]}</h1>
      <p class="notice-error">Soal gagal dimuat. Periksa koneksi internet, lalu coba lagi.</p>
      <button type="button" class="btn btn-primary btn-block" data-ulang>Coba lagi</button>
    </div>`;
  container.querySelector('[data-ulang]').addEventListener('click', () => location.reload());
}

export async function render(container, { jenis, nomor }) {
  let tes;
  try {
    tes = await muatTes();
  } catch (e) {
    console.error(e);
    layarGagal(container, jenis);
    return;
  }
  if (nomor === 'selesai') return renderSelesai(container, jenis);
  renderSoal(container, jenis, Number(nomor), tes);
}

// ---------- Satu soal ----------

function renderSoal(container, jenis, n, tes) {
  pastikanMulai(jenis);
  const jawabanAwal = bacaState().tes[jenis].jawaban[n - 1] ?? '';
  const soal = tes.soal[n - 1];
  const terakhir = n === JUMLAH_SOAL;

  container.innerHTML = `
    <div class="step-top">
      <span class="test-name">${NAMA[jenis]}</span>
      <span class="step-count">Soal ${n} dari ${JUMLAH_SOAL}</span>
    </div>
    <div class="progress" role="progressbar" aria-label="Kemajuan ${NAMA[jenis]}"
         aria-valuemin="0" aria-valuemax="${JUMLAH_SOAL}" aria-valuenow="${n}">
      <span class="progress-bar" style="width:${(n / JUMLAH_SOAL) * 100}%"></span>
    </div>

    ${n === 1 && tes.petunjuk ? `<p class="test-intro">${teksBarisHTML(tes.petunjuk)}</p>` : ''}
    ${soal.belumDiisi ? '<p class="notice notice-warn" role="note">Teks soal ini belum diisi oleh peneliti.</p>' : ''}

    <article class="soal-tes">
      <h1>${n}. ${teksBarisHTML(soal.judul)}</h1>
      <div class="soal-teks">${teksHTML(soal.teks)}${tabelHTML(soal.tabel)}</div>
    </article>

    <div class="field field-jawaban">
      <label for="jawaban">Jawabanmu (tulis langkah penyelesaian)</label>
      <textarea id="jawaban" rows="8" spellcheck="false" aria-describedby="jawaban-ket">${esc(jawabanAwal)}</textarea>
      <span id="jawaban-ket" class="field-hint">Jawaban tersimpan otomatis.</span>
    </div>

    <section class="konfirmasi" data-konfirmasi hidden aria-labelledby="konfirmasi-judul">
      <h2 id="konfirmasi-judul" tabindex="-1">Kirim jawaban?</h2>
      <p data-kosong></p>
      <p>Setelah dikirim, jawaban tidak bisa diubah lagi.</p>
      <div class="konfirmasi-aksi">
        <button type="button" class="btn btn-secondary" data-batal>Periksa lagi</button>
        <button type="button" class="btn btn-primary" data-kirim>Ya, kirim</button>
      </div>
    </section>

    <nav class="step-nav" aria-label="Navigasi soal">
      <button type="button" class="btn btn-secondary" data-sebelumnya ${n === 1 ? 'disabled' : ''}>Sebelumnya</button>
      <button type="button" class="btn btn-primary" data-berikutnya>${terakhir ? 'Kirim jawaban' : 'Berikutnya'}</button>
    </nav>
  `;

  const area = container.querySelector('#jawaban');
  area.addEventListener('input', () => {
    ubahState((s) => {
      s.tes[jenis].jawaban[n - 1] = area.value;
    });
  });

  container.querySelector('[data-sebelumnya]').addEventListener('click', () => {
    if (n > 1) location.hash = `#/tes/${jenis}/${n - 1}`;
  });

  const panel = container.querySelector('[data-konfirmasi]');
  container.querySelector('[data-berikutnya]').addEventListener('click', () => {
    if (!terakhir) {
      location.hash = `#/tes/${jenis}/${n + 1}`;
      return;
    }
    const kosong = bacaState().tes[jenis].jawaban
      .map((j, i) => (j.trim() ? null : i + 1))
      .filter(Boolean);
    panel.querySelector('[data-kosong]').textContent = kosong.length
      ? `Soal ${kosong.join(', ').replace(/, (\d+)$/, ' dan $1')} belum dijawab.`
      : 'Semua soal sudah dijawab.';
    panel.hidden = false;
    panel.querySelector('h2').focus();
  });

  panel.querySelector('[data-batal]').addEventListener('click', () => {
    panel.hidden = true;
    area.focus();
  });

  panel.querySelector('[data-kirim]').addEventListener('click', () => {
    ubahState((s) => {
      const t = s.tes[jenis];
      const selesai = new Date();
      t.selesai = selesai.toISOString();
      t.durasiDetik = Math.max(0, Math.round((selesai - new Date(t.mulai)) / 1000));
      t.terkirim = false;
    });
    location.hash = `#/tes/${jenis}/selesai`;
  });
}

// ---------- Setelah tes dikirim ----------

async function renderSelesai(container, jenis) {
  let tujuanLanjut = '#/modul';
  let labelLanjut = 'Ke peta modul';
  if (jenis === 'pre') {
    const daftar = await muatDaftarModul().catch(() => null);
    if (daftar?.length) {
      tujuanLanjut = `#/modul/${daftar[0].nomor}/langkah/1`;
      labelLanjut = `Mulai Modul ${daftar[0].nomor}`;
    }
  }

  container.innerHTML = `
    <div class="notice">
      <h1>${NAMA[jenis]} selesai</h1>
      <p>Terima kasih sudah mengerjakan semua soal.</p>
      <p data-status aria-live="polite"></p>
      <div class="aksi-kirim" data-aksi hidden>
        <button type="button" class="btn btn-primary btn-block" data-kirim-ulang>Kirim ulang</button>
        <button type="button" class="btn btn-secondary btn-block" data-salin>Salin jawaban</button>
        <p class="field-hint" data-salin-info aria-live="polite"></p>
      </div>
      <a class="btn btn-primary btn-block" href="${tujuanLanjut}" data-lanjut>${labelLanjut}</a>
      ${jenis === 'pre' ? '<a class="btn btn-secondary btn-block" href="#/modul">Ke peta modul</a>' : ''}
    </div>
  `;

  const status = container.querySelector('[data-status]');
  const aksi = container.querySelector('[data-aksi]');
  const tombolUlang = container.querySelector('[data-kirim-ulang]');

  async function coba() {
    if (bacaState().tes[jenis].terkirim) {
      status.textContent = 'Jawabanmu sudah terkirim ke guru.';
      aksi.hidden = true;
      return;
    }
    if (!sudahDiatur()) {
      status.textContent = 'Jawabanmu sudah tersimpan di perangkat ini.';
      aksi.hidden = true;
      return;
    }
    status.textContent = 'Mengirim jawaban…';
    tombolUlang.disabled = true;
    const hasil = await kirimHasilTes(bacaState(), jenis);
    tombolUlang.disabled = false;
    if (hasil.ok) {
      ubahState((s) => {
        s.tes[jenis].terkirim = true;
      });
      status.textContent = 'Jawabanmu sudah terkirim ke guru.';
      aksi.hidden = true;
    } else {
      status.textContent = 'Jawaban belum terkirim. Periksa internet, lalu tekan Kirim ulang. Jawabanmu tetap aman di perangkat ini.';
      aksi.hidden = false;
    }
  }

  tombolUlang.addEventListener('click', coba);
  container.querySelector('[data-salin]').addEventListener('click', async () => {
    const ok = await salinKeClipboard(teksSalin(bacaState(), jenis));
    container.querySelector('[data-salin-info]').textContent = ok
      ? 'Jawaban sudah disalin. Kirimkan ke guru lewat pesan.'
      : 'Gagal menyalin. Minta bantuan guru.';
  });

  fokusJudul(container);
  await coba();
}
