// Bantuan kecil untuk membuat HTML dengan aman.

export function esc(nilai) {
  return String(nilai ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Pindahkan fokus ke judul layar agar pembaca layar & keyboard mulai dari atas.
export function fokusJudul(container) {
  const judul = container.querySelector('h1');
  if (judul) {
    judul.setAttribute('tabindex', '-1');
    judul.focus({ preventScroll: true });
  }
}
