// Aturan akses (ARSITEKTUR.md bagian 6):
// pretest wajib dulu → modul terbuka berurutan → posttest setelah semua modul selesai.
// Status: 'selesai' | 'sedang' | 'terkunci'.

export function pretestSelesai(state) {
  return Boolean(state.tes.pre?.selesai);
}

export function statusPretest(state) {
  return pretestSelesai(state) ? 'selesai' : 'sedang';
}

// daftar: array modul dari data/daftar-modul.json (urut).
export function statusModul(daftar, state) {
  let bolehBuka = pretestSelesai(state);
  const hasil = {};
  for (const modul of daftar) {
    if (state.progres[modul.id]?.selesai) {
      hasil[modul.id] = 'selesai';
    } else if (bolehBuka) {
      hasil[modul.id] = 'sedang';
      bolehBuka = false; // modul berikutnya terkunci sampai yang ini selesai
    } else {
      hasil[modul.id] = 'terkunci';
    }
  }
  return hasil;
}

export function statusPosttest(daftar, state) {
  if (state.tes.post?.selesai) return 'selesai';
  const semuaSelesai = daftar.every((m) => state.progres[m.id]?.selesai);
  return pretestSelesai(state) && semuaSelesai ? 'sedang' : 'terkunci';
}

// Halaman tujuan setelah masuk.
export function ruteAwal(state) {
  return pretestSelesai(state) ? '#/modul' : '#/tes/pre/1';
}
