// Utilitários de interface: escape de HTML, formatação, toasts e modais.

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function fmtDate(v) {
  if (!v) return "—";
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : esc(v);
}
export const toInputDate = (v) => (v ? String(v).slice(0, 10) : "");
export const fmtMoney = (v) =>
  v === null || v === undefined ? "—" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmtKm = (v) =>
  v === null || v === undefined ? "—" : `${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
export const fmtCpf = (v) => String(v ?? "").replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

export function toast(message, type = "ok") {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.setAttribute("role", "status");
  el.textContent = message;
  box.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

// Abre um modal genérico. Retorna { el, close }.
export function openModal({ title, bodyHtml, wide = false }) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="modal ${wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <header><h2>${esc(title)}</h2><button type="button" class="icon-btn" data-close aria-label="Fechar">✕</button></header>
      <div class="modal-body">${bodyHtml}</div>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => { overlay.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector("[data-close]").addEventListener("click", close);
  return { el: overlay, close };
}

export function confirmDialog({ title, message, confirmLabel = "Excluir" }) {
  return new Promise((resolve) => {
    const m = openModal({
      title,
      bodyHtml: `<p class="confirm-text">${esc(message)}</p>
        <div class="form-actions">
          <button type="button" class="btn" data-no>Cancelar</button>
          <button type="button" class="btn danger" data-yes>${esc(confirmLabel)}</button>
        </div>`,
    });
    const done = (v) => { m.close(); resolve(v); };
    m.el.querySelector("[data-no]").addEventListener("click", () => done(false));
    m.el.querySelector("[data-yes]").addEventListener("click", () => done(true));
    m.el.querySelector("[data-close]").addEventListener("click", () => resolve(false));
    m.el.querySelector("[data-yes]").focus();
  });
}

// Tabela HTML a partir de colunas [{label, render(row), align}] e linhas.
export function tableHtml(columns, rows, { actions = false } = {}) {
  if (!rows.length) return `<div class="empty"><strong>Nenhum registro encontrado.</strong><span>Ajuste os filtros ou cadastre um novo item.</span></div>`;
  const head = columns.map((c) => `<th class="${c.align || ""}">${esc(c.label)}</th>`).join("") + (actions ? "<th class='right'>Ações</th>" : "");
  const body = rows.map((r, i) =>
    `<tr>${columns.map((c) => `<td class="${c.align || ""}" data-label="${esc(c.label)}">${c.render(r)}</td>`).join("")}` +
    (actions ? `<td class="right actions"><button class="btn sm" data-edit="${i}">Editar</button><button class="btn sm danger-outline" data-del="${i}">Excluir</button></td>` : "") +
    `</tr>`).join("");
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}
