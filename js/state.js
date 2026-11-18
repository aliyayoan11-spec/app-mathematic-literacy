// Baca/tulis progres siswa di localStorage (kunci: peluangku_v1).
// Bentuk data: lihat ARSITEKTUR.md bagian 4.

const KUNCI = 'peluangku_v1';

function stateAwal() {
  return {
    siswa: null,
    progres: {},
    latihan: {},
    tes: { pre: null, post: null },
  };
}

// Cadangan di memori jika localStorage tidak bisa dipakai (mis. mode privat).
let cadangan = null;

function rapikan(data) {
  const awal = stateAwal();
  if (!data || typeof data !== 'object') return awal;
  return {
    siswa: data.siswa ?? null,
    progres: { ...awal.progres, ...data.progres },
    latihan: { ...awal.latihan, ...data.latihan },
    tes: { ...awal.tes, ...data.tes },
  };
}

export function bacaState() {
  let teks;
  try {
    teks = localStorage.getItem(KUNCI);
  } catch (e) {
    // localStorage tidak bisa diakses → pakai cadangan di memori.
    return rapikan(cadangan);
  }
  if (!teks) return stateAwal();
  try {
    return rapikan(JSON.parse(teks));
  } catch (e) {
    console.warn('Data progres rusak, mulai dari awal.', e);
    return stateAwal();
  }
}

export function simpanState(state) {
  cadangan = state;
  try {
    localStorage.setItem(KUNCI, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn('Progres tidak bisa disimpan ke localStorage.', e);
    return false;
  }
}

// Ubah state lewat fungsi, lalu simpan. Mengembalikan state baru.
export function ubahState(ubah) {
  const state = bacaState();
  ubah(state);
  simpanState(state);
  return state;
}

export function simpanSiswa(kode, kelas) {
  return ubahState((s) => {
    s.siswa = { kode, kelas, mulai: new Date().toISOString() };
  });
}

// Hapus seluruh progres di perangkat ini (dipakai halaman peneliti).
export function hapusState() {
  cadangan = null;
  try {
    localStorage.removeItem(KUNCI);
  } catch (e) {
    console.warn('Progres tidak bisa dihapus dari localStorage.', e);
  }
}

export function sudahMasuk() {
  return Boolean(bacaState().siswa);
}
