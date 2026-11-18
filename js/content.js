// Pemuat konten JSON dari folder data/ (hasil disimpan sementara di memori).

const cache = new Map();

export async function muatJSON(path) {
  if (!cache.has(path)) {
    const janji = fetch(path).then((res) => {
      if (!res.ok) throw new Error(`Gagal memuat ${path} (${res.status})`);
      return res.json();
    });
    cache.set(path, janji);
    janji.catch(() => cache.delete(path)); // boleh dicoba lagi
  }
  return cache.get(path);
}

export async function muatDaftarModul() {
  const data = await muatJSON('data/daftar-modul.json');
  return data.modul;
}

// Muat 4 soal pretest/posttest (instrumen penelitian, tanpa kunci jawaban).
export async function muatTes() {
  const data = await muatJSON('data/tes.json');
  if (!Array.isArray(data.soal) || data.soal.length !== 4) {
    throw new Error('data/tes.json harus berisi tepat 4 soal');
  }
  return data;
}

// Muat isi satu modul. meta = satu item dari daftar-modul.json.
export async function muatModul(meta) {
  const data = await muatJSON(meta.file);
  if (!Array.isArray(data.langkah) || data.langkah.length === 0) {
    throw new Error(`${meta.file} tidak berisi langkah`);
  }
  return data;
}
