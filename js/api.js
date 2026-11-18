// Kirim hasil pretest/posttest ke Google Apps Script → Google Sheets.
// Data yang dikirim HANYA yang tercantum di ARSITEKTUR.md bagian 5.
import { APPS_SCRIPT_URL, VERSI_APLIKASI } from './config.js';

export function sudahDiatur() {
  return Boolean(APPS_SCRIPT_URL);
}

export function dataKirim(state, jenis) {
  const t = state.tes[jenis];
  const j = t.jawaban ?? [];
  return {
    kode: state.siswa?.kode ?? '',
    kelas: state.siswa?.kelas ?? '',
    jenisTes: jenis,
    jawaban1: j[0] ?? '',
    jawaban2: j[1] ?? '',
    jawaban3: j[2] ?? '',
    jawaban4: j[3] ?? '',
    waktuMulai: t.mulai ?? '',
    waktuSelesai: t.selesai ?? '',
    durasiDetik: t.durasiDetik ?? '',
    versiAplikasi: VERSI_APLIKASI,
  };
}

// Mengembalikan { ok: true } atau { ok: false, alasan: 'belum-diatur' | 'jaringan' | 'ditolak' }.
export async function kirimHasilTes(state, jenis) {
  if (!sudahDiatur()) return { ok: false, alasan: 'belum-diatur' };
  try {
    // text/plain agar tidak terkena pemeriksaan CORS preflight (ARSITEKTUR.md bagian 5).
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(dataKirim(state, jenis)),
    });
    const hasil = await res.json().catch(() => null);
    return hasil?.ok ? { ok: true } : { ok: false, alasan: 'ditolak' };
  } catch (e) {
    console.warn('Gagal mengirim hasil tes.', e);
    return { ok: false, alasan: 'jaringan' };
  }
}

// Teks cadangan untuk tombol "Salin jawaban".
export function teksSalin(state, jenis) {
  const d = dataKirim(state, jenis);
  const nama = jenis === 'pre' ? 'Pretest' : 'Posttest';
  return [
    `PeluangKu — ${nama}`,
    `Kode: ${d.kode} | Kelas: ${d.kelas}`,
    `Mulai: ${d.waktuMulai} | Selesai: ${d.waktuSelesai} | Durasi: ${d.durasiDetik} detik | Versi: ${d.versiAplikasi}`,
    '',
    ...[1, 2, 3, 4].map((n) => `Soal ${n}:\n${d[`jawaban${n}`] || '(kosong)'}\n`),
  ].join('\n');
}

export async function salinKeClipboard(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    // Cadangan untuk browser lama: textarea tersembunyi + execCommand.
    const area = document.createElement('textarea');
    area.value = teks;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}
