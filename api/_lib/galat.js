// Daftar galat chatbot: kode untuk frontend, pesan untuk siswa, dan petunjuk untuk pengembang (log).
// Pesan siswa tidak memuat istilah teknis. Petunjuk pengembang hanya muncul di log
// (terminal `npm run dev` atau Vercel → Logs), tidak pernah dikirim ke HP siswa.

const LAPOR_GURU = 'Beri tahu guru atau peneliti. Sambil menunggu, kamu tetap bisa memakai tombol Hint.';
const COBA_LAGI = 'Sambil menunggu, kamu tetap bisa memakai tombol Hint.';

export const GALAT = {
  METODE_SALAH: {
    status: 405,
    siswa: 'Permintaan tidak dikenali.',
    log: 'Endpoint /api/chat hanya menerima POST.',
  },
  KEY_BELUM_DIATUR: {
    status: 500,
    siswa: `Pembimbing belum siap dipakai. ${LAPOR_GURU}`,
    log: 'DEEPSEEK_API_KEY kosong. Lokal: salin .env.example menjadi .env lalu isi key. Online: Vercel → Settings → Environment Variables, lalu Redeploy.',
  },
  PERMINTAAN_TIDAK_VALID: {
    status: 400,
    siswa: 'Pesanmu tidak bisa dikirim. Coba tulis ulang.',
    log: 'Isi permintaan dari frontend tidak sesuai format (lihat ARSITEKTUR.md 8.3).',
  },
  KEY_TIDAK_VALID: {
    status: 502,
    siswa: `Pembimbing belum bisa dipakai. ${LAPOR_GURU}`,
    log: 'DeepSeek 401: API key ditolak. Periksa DEEPSEEK_API_KEY (salah ketik, sudah dihapus, atau dari akun lain).',
  },
  SALDO_HABIS: {
    status: 502,
    siswa: `Pembimbing sedang tidak aktif. ${LAPOR_GURU}`,
    log: 'DeepSeek 402: saldo tidak cukup. Top up di https://platform.deepseek.com (Top up / Billing).',
  },
  PERMINTAAN_DITOLAK: {
    status: 502,
    siswa: 'Pembimbing tidak bisa memproses pesan ini. Coba tulis dengan kalimat lain.',
    log: 'DeepSeek 400/422: format atau parameter permintaan ditolak. Periksa DEEPSEEK_MODEL dan isi pesan.',
  },
  TERLALU_RAMAI: {
    status: 429,
    siswa: `Pembimbing sedang ramai. Tunggu sekitar satu menit, lalu kirim lagi. ${COBA_LAGI}`,
    log: 'DeepSeek 429: batas laju permintaan tercapai.',
  },
  LAYANAN_GANGGUAN: {
    status: 502,
    siswa: `Layanan pembimbing sedang gangguan. Coba lagi beberapa menit lagi. ${COBA_LAGI}`,
    log: 'DeepSeek 5xx: server DeepSeek gangguan atau kelebihan beban. Cek https://status.deepseek.com.',
  },
  WAKTU_HABIS: {
    status: 504,
    siswa: `Pembimbing terlalu lama menjawab. Kirim pesanmu sekali lagi. ${COBA_LAGI}`,
    log: 'DeepSeek tidak menjawab dalam batas waktu.',
  },
  TIDAK_TERHUBUNG: {
    status: 502,
    siswa: `Pembimbing tidak bisa dihubungi. Coba lagi sebentar lagi. ${COBA_LAGI}`,
    log: 'Gagal terhubung ke api.deepseek.com (jaringan/DNS).',
  },
  BALASAN_KOSONG: {
    status: 502,
    siswa: `Pembimbing tidak memberi jawaban. Kirim pesanmu sekali lagi. ${COBA_LAGI}`,
    log: 'DeepSeek menjawab, tetapi isi balasannya kosong atau tidak bisa dibaca.',
  },
};

// Status HTTP dari DeepSeek → kode galat.
export function kodeDariStatusDeepSeek(status) {
  if (status === 401 || status === 403) return 'KEY_TIDAK_VALID';
  if (status === 402) return 'SALDO_HABIS';
  if (status === 400 || status === 422) return 'PERMINTAAN_DITOLAK';
  if (status === 429) return 'TERLALU_RAMAI';
  return 'LAYANAN_GANGGUAN';
}
