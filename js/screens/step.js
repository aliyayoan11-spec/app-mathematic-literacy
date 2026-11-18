// Layar Langkah materi: satu langkah per layar, visual di atas teks,
// tombol Kembali/Lanjut, indikator progres. Siswa mengatur tempo sendiri.
import { ubahState } from '../state.js';
import { muatDaftarModul, muatModul } from '../content.js';
import { teksHTML, teksBarisHTML } from '../components/teks.js';
import { visualHTML } from '../components/visuals.js';
import { esc } from '../dom.js';

// Posisi layar sebelumnya, untuk tahu apakah siswa datang dengan tombol Kembali.
let posisiSebelumnya = null;

// ---------- Penyaji per tipe langkah ----------
// Setiap penyaji mengembalikan { label, judul, html, pasang?(root), lanjut?(), kembali?(), sisa?() }.
// lanjut()/kembali() mengembalikan true jika tombol "dipakai" di dalam layar (mis. membuka tahap).

function penjelasan(l) {
  return {
    judul: l.judul,
    html: `${visualHTML(l.visual)}<div class="step-text">${teksHTML(l.teks)}</div>`,
  };
}

function ringkasan(l) {
  const poin = (l.poin ?? []).map((p) => `<li>${teksHTML(p)}</li>`).join('');
  return {
    label: l.judul ? 'Ringkasan' : null,
    judul: l.judul ?? 'Ringkasan',
    html: `${visualHTML(l.visual)}${teksHTML(l.teks)}<ul class="ringkasan-list">${poin}</ul>`,
  };
}

// Contoh bertahap: tahap muncul satu per satu setiap siswa menekan Lanjut.
function contoh(l, { mundur }) {
  const tahap = l.tahap ?? [];
  const total = tahap.length;
  let tampil = mundur ? total : Math.min(1, total);
  let item = [];
  let info = null;

  function perbarui(gulir) {
    item.forEach((el, i) => {
      el.hidden = i >= tampil;
      el.classList.toggle('tahap-baru', i === tampil - 1);
    });
    info.textContent = `Tahap ${tampil} dari ${total}`;
    if (gulir) item[tampil - 1]?.scrollIntoView({ block: 'nearest' });
  }

  return {
    label: 'Contoh',
    judul: l.judul,
    html: `
      ${visualHTML(l.visual)}
      ${teksHTML(l.teks)}
      <p class="tahap-info" data-info></p>
      <ol class="tahap-list" aria-live="polite">
        ${tahap.map((t) => `<li class="tahap" hidden>${visualHTML(t.visual)}${teksHTML(t.teks)}</li>`).join('')}
      </ol>`,
    pasang(root) {
      item = [...root.querySelectorAll('.tahap')];
      info = root.querySelector('[data-info]');
      perbarui(false);
    },
    lanjut() {
      if (tampil >= total) return false;
      tampil += 1;
      perbarui(true);
      return true;
    },
    kembali() {
      if (tampil <= 1) return false;
      tampil -= 1;
      perbarui(false);
      return true;
    },
    sisa: () => total - tampil,
  };
}

// Tipe yang belum dibuat (latihan, simulasi, contoh-berlubang) → pesan singkat.
function belumDidukung(l) {
  return {
    judul: l.judul ?? 'Segera hadir',
    html: `<div class="notice"><p>Bagian ini (${esc(l.tipe)}) sedang dibuat. Tekan Lanjut untuk meneruskan.</p></div>`,
  };
}

const PENYAJI = { penjelasan, contoh, ringkasan };

// ---------- Layar ----------

function layarGagal(container, nomor) {
  container.innerHTML = `
    <div class="notice">
      <h1>Modul ${esc(nomor)}</h1>
      <p>Materi modul ini belum bisa dibuka. Mungkin belum tersedia, atau koneksi internet terputus.</p>
      <button type="button" class="btn btn-primary btn-block" data-ulang>Coba lagi</button>
      <a class="btn btn-secondary btn-block" href="#/modul">Ke peta modul</a>
    </div>`;
  container.querySelector('[data-ulang]').addEventListener('click', () => location.reload());
}

export async function render(container, { nomor, k }) {
  const daftar = await muatDaftarModul();
  const meta = daftar.find((m) => m.nomor === nomor);

  let modul;
  try {
    modul = await muatModul(meta);
  } catch (e) {
    console.error(e);
    layarGagal(container, nomor);
    return;
  }

  const total = modul.langkah.length;
  if (k < 1 || k > total) {
    location.replace(`#/modul/${nomor}/langkah/${Math.min(Math.max(k, 1), total)}`);
    return;
  }

  const mundur = posisiSebelumnya?.id === meta.id && posisiSebelumnya.k > k;
  posisiSebelumnya = { id: meta.id, k };

  ubahState((s) => {
    s.progres[meta.id] = { ...s.progres[meta.id], langkahTerakhir: k };
  });

  const langkah = modul.langkah[k - 1];
  const penyaji = (PENYAJI[langkah.tipe] ?? belumDidukung)(langkah, { mundur });
  const persen = Math.round((k / total) * 100);

  container.innerHTML = `
    <div class="step-top">
      <a class="step-back" href="#/modul"><span aria-hidden="true">←</span> Peta modul</a>
      <span class="step-count">Langkah ${k} dari ${total}</span>
    </div>
    <div class="progress" role="progressbar" aria-label="Kemajuan modul ${esc(nomor)}"
         aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${k}">
      <span class="progress-bar" style="width:${persen}%"></span>
    </div>

    <article class="step">
      <header class="step-head">
        ${penyaji.label ? `<p class="step-kicker">${esc(penyaji.label)}</p>` : ''}
        <h1>${teksBarisHTML(penyaji.judul ?? `Modul ${meta.nomor} · ${modul.judul ?? meta.judul}`)}</h1>
      </header>
      <div class="step-body">${penyaji.html}</div>
    </article>

    <nav class="step-nav" aria-label="Navigasi langkah">
      <button type="button" class="btn btn-secondary" data-kembali>Kembali</button>
      <button type="button" class="btn btn-primary" data-lanjut>Lanjut</button>
    </nav>
  `;

  const tombolLanjut = container.querySelector('[data-lanjut]');
  const aturLabel = () => {
    const habis = !penyaji.sisa || penyaji.sisa() === 0;
    tombolLanjut.textContent = k === total && habis ? 'Selesai' : 'Lanjut';
  };

  penyaji.pasang?.(container.querySelector('.step-body'));
  aturLabel();

  tombolLanjut.addEventListener('click', () => {
    if (penyaji.lanjut?.()) return aturLabel();
    if (k < total) {
      location.hash = `#/modul/${nomor}/langkah/${k + 1}`;
      return;
    }
    // Langkah terakhir: tandai modul selesai, kembali ke peta.
    ubahState((s) => {
      s.progres[meta.id] = { ...s.progres[meta.id], selesai: true };
    });
    location.hash = '#/modul';
  });

  container.querySelector('[data-kembali]').addEventListener('click', () => {
    if (penyaji.kembali?.()) return aturLabel();
    location.hash = k > 1 ? `#/modul/${nomor}/langkah/${k - 1}` : '#/modul';
  });
}
