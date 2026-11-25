// Fábrica de páginas CRUD: listagem + filtros (consultando a API) + cadastro/edição em modal + exclusão.
import { api, qs } from "./api.js";
import { esc, openModal, confirmDialog, toast, tableHtml } from "./ui.js";

function fieldHtml(f, value, options) {
  const id = `f_${f.name}`;
  const req = f.required ? "required" : "";
  const v = value ?? f.default ?? "";
  let input;
  if (f.type === "select") {
    const opts = (options || []).map((o) =>
      `<option value="${esc(o.value)}" ${String(o.value) === String(v) ? "selected" : ""}>${esc(o.label)}</option>`).join("");
    input = `<select id="${id}" name="${f.name}" ${req}><option value="">Selecione…</option>${opts}</select>`;
  } else if (f.type === "select-static") {
    const opts = f.choices.map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("");
    input = `<select id="${id}" name="${f.name}" ${req}><option value="">Selecione…</option>${opts}</select>`;
  } else {
    const attrs = [
      f.maxlength ? `maxlength="${f.maxlength}"` : "", f.minlength ? `minlength="${f.minlength}"` : "",
      f.min !== undefined ? `min="${f.min}"` : "", f.max !== undefined ? `max="${f.max}"` : "",
      f.step ? `step="${f.step}"` : "", f.pattern ? `pattern="${f.pattern}"` : "",
      f.placeholder ? `placeholder="${esc(f.placeholder)}"` : "", f.inputmode ? `inputmode="${f.inputmode}"` : "",
    ].join(" ");
    input = `<input id="${id}" name="${f.name}" type="${f.type || "text"}" value="${esc(v)}" ${attrs} ${req}>`;
  }
  return `<div class="field ${f.span === 2 ? "span2" : ""}">
    <label for="${id}">${esc(f.label)}${f.required ? ' <b class="req">*</b>' : ""}</label>${input}
    ${f.hint ? `<small>${esc(f.hint)}</small>` : ""}</div>`;
}

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export function createCrudPage(cfg) {
  return {
    title: cfg.title,
    async render(root) {
      const state = { rows: [], filters: {} };
      root.innerHTML = `
        <div class="page-head">
          <div><h1>${esc(cfg.title)}</h1><p class="muted">${esc(cfg.subtitle)}</p></div>
          <button class="btn primary" id="btn-new">+ ${esc(cfg.newLabel)}</button>
        </div>
        <form class="filters" id="filters" autocomplete="off"></form>
        <div class="result-bar"><span id="count" class="muted"></span><code class="route" id="route"></code></div>
        <div id="list" aria-live="polite"></div>`;

      const filtersEl = root.querySelector("#filters");
      const listEl = root.querySelector("#list");

      // ---- filtros ----
      const filterOptions = {};
      for (const f of cfg.filters) if (f.options) filterOptions[f.param] = await f.options().catch(() => []);
      filtersEl.innerHTML =
        cfg.filters.map((f) => {
          const id = `flt_${f.param}`;
          let input;
          if (f.type === "select") {
            const o = (f.options ? filterOptions[f.param] : f.choices).map((x) => `<option value="${esc(x.value)}">${esc(x.label)}</option>`).join("");
            input = `<select id="${id}" name="${f.param}"><option value="">Todos</option>${o}</select>`;
          } else {
            input = `<input id="${id}" name="${f.param}" type="${f.type || "text"}" placeholder="${esc(f.placeholder || "")}" ${f.min !== undefined ? `min="${f.min}"` : ""}>`;
          }
          return `<div class="field"><label for="${id}">${esc(f.label)}</label>${input}</div>`;
        }).join("") +
        `<div class="filter-actions"><button class="btn primary" type="submit">Filtrar</button><button class="btn" type="button" id="clear">Limpar</button></div>`;

      const load = async () => {
        listEl.innerHTML = `<div class="loading">Carregando…</div>`;
        const path = `${cfg.endpoint}${qs(state.filters)}`;
        root.querySelector("#route").textContent = `GET ${path}`;
        try {
          state.rows = await api.get(path);
          root.querySelector("#count").textContent = `${state.rows.length} registro(s)`;
          listEl.innerHTML = tableHtml(cfg.columns, state.rows, { actions: true });
        } catch (e) {
          root.querySelector("#count").textContent = "";
          listEl.innerHTML = `<div class="alert error">${esc(e.message)}</div>`;
        }
      };

      filtersEl.addEventListener("submit", (e) => {
        e.preventDefault();
        state.filters = Object.fromEntries(new FormData(filtersEl).entries());
        load();
      });
      filtersEl.querySelector("#clear").addEventListener("click", () => { filtersEl.reset(); state.filters = {}; load(); });

      // ---- formulário (criar/editar) ----
      async function openForm(row) {
        const editing = !!row;
        const options = {};
        for (const f of cfg.fields) if (f.options) options[f.name] = await f.options().catch(() => []);
        const modal = openModal({
          title: editing ? `Editar ${cfg.singular}` : `Novo ${cfg.singular}`,
          wide: cfg.fields.length > 4,
          bodyHtml: `<form id="crud-form" novalidate>
            <div class="alert error hidden" id="form-error"></div>
            <div class="grid">${cfg.fields.map((f) => fieldHtml(f, row ? cfg.toForm(row)[f.name] : undefined, options[f.name])).join("")}</div>
            <div class="form-actions">
              <button type="button" class="btn" data-cancel>Cancelar</button>
              <button type="submit" class="btn primary">${editing ? "Salvar alterações" : "Cadastrar"}</button>
            </div></form>`,
        });
        const form = modal.el.querySelector("#crud-form");
        const errBox = modal.el.querySelector("#form-error");
        modal.el.querySelector("[data-cancel]").addEventListener("click", modal.close);
        if (cfg.afterRender) cfg.afterRender(form, { options, row });
        form.querySelector("input,select")?.focus();

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          errBox.classList.add("hidden");
          if (!form.checkValidity()) { form.reportValidity(); return; }
          const values = Object.fromEntries(new FormData(form).entries());
          const btn = form.querySelector("button[type=submit]");
          btn.disabled = true;
          try {
            const payload = cfg.toPayload(values);
            if (editing) await api.put(`${cfg.endpoint}/${row.id}`, payload);
            else await api.post(cfg.endpoint, payload);
            modal.close();
            toast(`${cap(cfg.singular)} ${editing ? "atualizado" : "cadastrado"} com sucesso.`);
            load();
          } catch (err) {
            errBox.textContent = err.message;
            errBox.classList.remove("hidden");
            btn.disabled = false;
          }
        });
      }

      root.querySelector("#btn-new").addEventListener("click", () => openForm(null));
      listEl.addEventListener("click", async (e) => {
        const ed = e.target.closest("[data-edit]");
        const dl = e.target.closest("[data-del]");
        if (ed) openForm(state.rows[Number(ed.dataset.edit)]);
        if (dl) {
          const row = state.rows[Number(dl.dataset.del)];
          const ok = await confirmDialog({ title: `Excluir ${cfg.singular}`, message: `Deseja excluir ${cfg.describe(row)}? Esta ação não pode ser desfeita.` });
          if (!ok) return;
          try { await api.del(`${cfg.endpoint}/${row.id}`); toast(`${cap(cfg.singular)} excluído com sucesso.`); load(); }
          catch (err) { toast(err.message, "error"); }
        }
      });

      load();
    },
  };
}
