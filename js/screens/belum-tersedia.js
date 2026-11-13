// Layar sementara untuk bagian yang belum dibuat (dihapus setelah Tahap 6).
import { esc } from '../dom.js';

export function render(container, { judul }) {
  container.innerHTML = `
    <div class="notice">
      <h1>${esc(judul)}</h1>
      <p>Bagian ini sedang dibuat.</p>
      <a class="btn btn-primary btn-block" href="#/modul">Ke peta modul</a>
    </div>
  `;
}
