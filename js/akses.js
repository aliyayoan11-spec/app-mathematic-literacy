// Aturan akses (ARSITEKTUR.md bagian 6) - Mode Bebas Testing
export function pretestSelesai(state) {
  return true;
}

export function statusPretest(state) {
  return 'selesai';
}

// daftar: array modul dari data/daftar-modul.json (urut).
export function statusModul(daftar, state) {
  const hasil = {};
  for (const modul of daftar) {
    hasil[modul.id] = 'sedang'; // Bikin semua modul terbuka/bisa diakses
  }
  return hasil;
}

export function statusPosttest(daftar, state) {
  return 'sedang'; // Posttest langsung terbuka juga
}

// Halaman tujuan setelah masuk.
export function ruteAwal(state) {
  return '#/modul';
}