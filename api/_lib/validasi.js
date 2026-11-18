// Memeriksa dan merapikan isi permintaan dari frontend sebelum dikirim ke DeepSeek.
// Format permintaan: ARSITEKTUR.md bagian 8.3.

export const BATAS = {
  jumlahPesan: 20,
  karakterPesan: 1000,
  karakterKonteks: 1000,
};

// Peran dari frontend → peran di API DeepSeek. Peran "system" sengaja tidak ada,
// jadi frontend tidak bisa mengganti prompt sistem.
const PERAN = { siswa: 'user', pembimbing: 'assistant' };

function teksKonteks(nilai, nama) {
  if (nilai == null) return { ok: true, teks: '' };
  if (typeof nilai !== 'string') return { ok: false, galat: `konteks.${nama} harus berupa teks.` };
  const teks = nilai.trim();
  if (teks.length > BATAS.karakterKonteks) {
    return { ok: false, galat: `konteks.${nama} terlalu panjang (maks ${BATAS.karakterKonteks} karakter).` };
  }
  return { ok: true, teks };
}

// Mengembalikan { ok: true, pesan, konteks } atau { ok: false, galat }.
export function validasiPermintaan(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, galat: 'Permintaan harus berupa objek JSON.' };
  }

  const { pesan, konteks } = body;
  if (!Array.isArray(pesan) || pesan.length === 0) {
    return { ok: false, galat: 'Belum ada pesan.' };
  }
  if (pesan.length > BATAS.jumlahPesan) {
    return { ok: false, galat: `Percakapan terlalu panjang (maks ${BATAS.jumlahPesan} pesan). Mulai percakapan baru.` };
  }

  const rapi = [];
  for (const p of pesan) {
    if (!p || typeof p !== 'object' || !Object.hasOwn(PERAN, p.peran)) {
      return { ok: false, galat: 'Peran pesan harus "siswa" atau "pembimbing".' };
    }
    if (typeof p.isi !== 'string' || !p.isi.trim()) {
      return { ok: false, galat: 'Isi pesan tidak boleh kosong.' };
    }
    if (p.isi.length > BATAS.karakterPesan) {
      return { ok: false, galat: `Pesan terlalu panjang (maks ${BATAS.karakterPesan} karakter).` };
    }
    rapi.push({ role: PERAN[p.peran], content: p.isi.trim() });
  }

  if (rapi[rapi.length - 1].role !== 'user') {
    return { ok: false, galat: 'Pesan terakhir harus dari siswa.' };
  }

  let soal = { ok: true, teks: '' };
  let pertanyaan = { ok: true, teks: '' };
  if (konteks != null) {
    if (typeof konteks !== 'object' || Array.isArray(konteks)) {
      return { ok: false, galat: 'konteks harus berupa objek.' };
    }
    soal = teksKonteks(konteks.soal, 'soal');
    if (!soal.ok) return soal;
    pertanyaan = teksKonteks(konteks.pertanyaan, 'pertanyaan');
    if (!pertanyaan.ok) return pertanyaan;
  }

  return { ok: true, pesan: rapi, konteks: { soal: soal.teks, pertanyaan: pertanyaan.teks } };
}
