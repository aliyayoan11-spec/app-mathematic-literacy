// Titik masuk aplikasi + router hash sederhana.
// Daftar rute: ARSITEKTUR.md bagian 6.
import { bacaState } from './state.js';
import { ruteAwal, statusModul, statusPosttest } from './akses.js';
import { muatDaftarModul } from './content.js';
import { fokusJudul } from './dom.js';
import * as login from './screens/login.js';
import * as moduleMap from './screens/module-map.js';
import * as step from './screens/step.js';
import * as test from './screens/test.js';
import * as peneliti from './screens/peneliti.js';

const app = document.getElementById('app');

// Ganti alamat tanpa menambah riwayat (agar tombol Kembali browser tidak terjebak).
function alihkan(hash) {
  location.replace(hash);
}

// Setiap rute: pola + fungsi yang mengembalikan { layar, data } atau { alihkan }.
const rute = [
  {
    pola: /^#\/masuk$/,
    publik: true,
    buka: (_, state) => (state.siswa ? { alihkan: ruteAwal(state) } : { layar: login }),
  },
  {
    pola: /^#\/modul$/,
    buka: () => ({ layar: moduleMap }),
  },
  {
    pola: /^#\/modul\/(\d+)\/langkah\/(\d+)$/,
    buka: async ([nomor, k], state) => {
      const daftar = await muatDaftarModul();
      const modul = daftar.find((m) => m.nomor === Number(nomor));
      if (!modul || statusModul(daftar, state)[modul.id] === 'terkunci') {
        return { alihkan: '#/modul' };
      }
      return { layar: step, data: { nomor: modul.nomor, k: Number(k) } };
    },
  },
  {
    // Soal 1–4, atau halaman "selesai" setelah jawaban dikirim.
    pola: /^#\/tes\/(pre|post)\/([1-4]|selesai)$/,
    buka: async ([jenis, nomor], state) => {
      if (jenis === 'post') {
        const daftar = await muatDaftarModul();
        if (statusPosttest(daftar, state) === 'terkunci') return { alihkan: '#/modul' };
      }
      const sudahDikirim = Boolean(state.tes[jenis]?.selesai);
      // Tes yang sudah dikirim tidak bisa dibuka/diubah lagi.
      if (sudahDikirim && nomor !== 'selesai') return { alihkan: `#/tes/${jenis}/selesai` };
      if (!sudahDikirim && nomor === 'selesai') return { alihkan: `#/tes/${jenis}/1` };
      return { layar: test, data: { jenis, nomor } };
    },
  },
  {
    pola: /^#\/selesai$/,
    buka: (_, state) => ({ alihkan: state.tes.post?.selesai ? '#/tes/post/selesai' : '#/modul' }),
  },
  {
    // Halaman peneliti: tersembunyi, tidak ditautkan di aplikasi.
    pola: /^#\/peneliti$/,
    publik: true,
    buka: () => ({ layar: peneliti }),
  },
];

let nomorRender = 0;

async function jalankan() {
  const kini = ++nomorRender;
  const hash = location.hash || '#/';
  const state = bacaState();

  const cocok = rute
    .map((r) => ({ r, m: hash.match(r.pola) }))
    .find(({ m }) => m);

  // Alamat tidak dikenal → halaman awal yang sesuai.
  if (!cocok) return alihkan(state.siswa ? ruteAwal(state) : '#/masuk');
  // Belum masuk → wajib ke layar Masuk.
  if (!cocok.r.publik && !state.siswa) return alihkan('#/masuk');

  let hasil;
  try {
    hasil = await cocok.r.buka(cocok.m.slice(1), state);
  } catch (e) {
    console.error(e);
    hasil = { alihkan: '#/modul' };
    if (hash === '#/modul') return; // hindari putaran tanpa akhir
  }
  if (kini !== nomorRender) return; // sudah ada perpindahan layar yang lebih baru
  if (hasil.alihkan) return alihkan(hasil.alihkan);

  await hasil.layar.render(app, hasil.data ?? {});
  if (kini !== nomorRender) return;
  window.scrollTo(0, 0);
  fokusJudul(app);
}

window.addEventListener('hashchange', jalankan);
jalankan();
