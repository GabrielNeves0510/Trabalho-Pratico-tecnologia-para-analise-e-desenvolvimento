// Tela de consultas: usa as 5 rotas de /api/Filtros (JOINs entre tabelas) e mostra o SQL equivalente.
import { api } from "../api.js";
import { esc, fmtDate, fmtMoney, fmtKm, tableHtml } from "../ui.js";
import { fabricanteOptions, clienteOptions, aluguelOptions } from "../lookups.js";

const CONSULTAS = [
  {
    id: "veiculos-por-fabricante", titulo: "Veículos por fabricante", descricao: "Lista os veículos de um fabricante.",
    param: { label: "Fabricante", options: fabricanteOptions },
    rota: (id) => `/api/Filtros/veiculos-por-fabricante/${id}`,
    sql: "SELECT v.Id, v.Modelo, v.AnoFabricacao, v.Quilometragem, v.Placa, f.Nome\nFROM Veiculos v\nJOIN Fabricantes f ON f.Id = v.FabricanteId\nWHERE v.FabricanteId = @fabricanteId;",
    colunas: [
      { label: "ID", render: (r) => r.id }, { label: "Modelo", render: (r) => `<strong>${esc(r.modelo)}</strong>` },
      { label: "Fabricante", render: (r) => esc(r.fabricante) }, { label: "Ano", render: (r) => r.anoFabricacao },
      { label: "Placa", render: (r) => `<span class="plate">${esc(r.placa)}</span>` },
      { label: "Quilometragem", align: "right", render: (r) => fmtKm(r.quilometragem) },
    ],
  },
  {
    id: "alugueis-por-cliente", titulo: "Aluguéis por cliente", descricao: "Histórico de locações de um cliente.",
    param: { label: "Cliente", options: clienteOptions },
    rota: (id) => `/api/Filtros/alugueis-por-cliente/${id}`,
    sql: "SELECT a.Id, c.Nome, v.Modelo, a.DataInicio, a.DataDevolucao, a.ValorTotal\nFROM Alugueis a\nJOIN Clientes c ON c.Id = a.ClienteId\nJOIN Veiculos v ON v.Id = a.VeiculoId\nWHERE a.ClienteId = @clienteId;",
    total: { label: "Total locado", get: (r) => r.valorTotal },
    colunas: [
      { label: "Aluguel", render: (r) => `#${r.id}` }, { label: "Cliente", render: (r) => `<strong>${esc(r.cliente)}</strong>` },
      { label: "Veículo", render: (r) => esc(r.veiculo) }, { label: "Início", render: (r) => fmtDate(r.dataInicio) },
      { label: "Devolução", render: (r) => r.dataDevolucao ? fmtDate(r.dataDevolucao) : `<span class="badge warn">Em aberto</span>` },
      { label: "Total", align: "right", render: (r) => fmtMoney(r.valorTotal) },
    ],
  },
  {
    id: "veiculos-alugados", titulo: "Veículos alugados agora", descricao: "Locações ainda sem devolução.",
    rota: () => "/api/Filtros/veiculos-alugados",
    sql: "SELECT v.Id, v.Modelo, v.Placa, c.Nome, a.DataInicio, a.DataPrevistaDevolucao\nFROM Alugueis a\nJOIN Veiculos v ON v.Id = a.VeiculoId\nJOIN Clientes c ON c.Id = a.ClienteId\nWHERE a.DataDevolucao IS NULL;",
    colunas: [
      { label: "Veículo", render: (r) => `<strong>${esc(r.veiculo)}</strong>` },
      { label: "Placa", render: (r) => `<span class="plate">${esc(r.placa)}</span>` },
      { label: "Cliente", render: (r) => esc(r.cliente) }, { label: "Início", render: (r) => fmtDate(r.dataInicio) },
      { label: "Devolução prevista", render: (r) => fmtDate(r.dataPrevistaDevolucao) },
    ],
  },
  {
    id: "pagamentos-por-aluguel", titulo: "Pagamentos por aluguel", descricao: "Pagamentos de uma locação específica.",
    param: { label: "Aluguel", options: aluguelOptions },
    rota: (id) => `/api/Filtros/pagamentos-por-aluguel/${id}`,
    sql: "SELECT p.Id, p.DataPagamento, p.Valor, p.FormaPagamento, c.Nome\nFROM Pagamentos p\nJOIN Alugueis a ON a.Id = p.AluguelId\nJOIN Clientes c ON c.Id = a.ClienteId\nWHERE p.AluguelId = @aluguelId;",
    total: { label: "Total pago", get: (r) => r.valor },
    colunas: [
      { label: "ID", render: (r) => r.id }, { label: "Cliente", render: (r) => `<strong>${esc(r.cliente)}</strong>` },
      { label: "Data", render: (r) => fmtDate(r.dataPagamento) },
      { label: "Forma", render: (r) => `<span class="badge">${esc(r.formaPagamento)}</span>` },
      { label: "Valor", align: "right", render: (r) => fmtMoney(r.valor) },
    ],
  },
  {
    id: "alugueis-por-fabricante", titulo: "Aluguéis por fabricante", descricao: "Locações de veículos de uma marca (3 JOINs).",
    param: { label: "Fabricante", options: fabricanteOptions },
    rota: (id) => `/api/Filtros/alugueis-por-fabricante/${id}`,
    sql: "SELECT a.Id, f.Nome, v.Modelo, v.Placa, c.Nome, a.DataInicio, a.DataDevolucao, a.ValorTotal\nFROM Alugueis a\nJOIN Veiculos v ON v.Id = a.VeiculoId\nJOIN Fabricantes f ON f.Id = v.FabricanteId\nJOIN Clientes c ON c.Id = a.ClienteId\nWHERE v.FabricanteId = @fabricanteId;",
    total: { label: "Total locado", get: (r) => r.valorTotal },
    colunas: [
      { label: "Aluguel", render: (r) => `#${r.id}` }, { label: "Fabricante", render: (r) => esc(r.fabricante) },
      { label: "Veículo", render: (r) => `${esc(r.veiculo)} <span class="plate">${esc(r.placa)}</span>` },
      { label: "Cliente", render: (r) => esc(r.cliente) }, { label: "Início", render: (r) => fmtDate(r.dataInicio) },
      { label: "Devolução", render: (r) => r.dataDevolucao ? fmtDate(r.dataDevolucao) : `<span class="badge warn">Em aberto</span>` },
      { label: "Total", align: "right", render: (r) => fmtMoney(r.valorTotal) },
    ],
  },
];

export default {
  title: "Consultas",
  async render(root) {
    root.innerHTML = `
      <div class="page-head"><div><h1>Consultas</h1>
        <p class="muted">Consultas com relacionamento entre tabelas (JOIN), executadas pelas rotas <code>/api/Filtros</code>.</p></div></div>
      <div class="tabs" role="tablist">${CONSULTAS.map((c, i) => `<button role="tab" class="tab ${i === 0 ? "active" : ""}" data-i="${i}">${esc(c.titulo)}</button>`).join("")}</div>
      <section id="consulta"></section>`;
    const box = root.querySelector("#consulta");

    async function show(i) {
      const c = CONSULTAS[i];
      root.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", Number(t.dataset.i) === i));
      let opts = [];
      if (c.param) opts = await c.param.options().catch(() => []);
      box.innerHTML = `
        <div class="card">
          <div class="query-head"><div><h2>${esc(c.titulo)}</h2><p class="muted">${esc(c.descricao)}</p></div>
            <form class="inline-form" id="qform">
              ${c.param ? `<div class="field"><label for="qsel">${esc(c.param.label)}</label>
                <select id="qsel" required><option value="">Selecione…</option>${opts.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join("")}</select></div>` : ""}
              <button class="btn primary" type="submit">Executar consulta</button>
            </form></div>
          <details class="sql"><summary>Ver SQL equivalente</summary><pre>${esc(c.sql)}</pre></details>
        </div>
        <div class="result-bar"><span id="qcount" class="muted"></span><code class="route" id="qroute"></code></div>
        <div id="qresult"><div class="empty"><strong>Nenhuma consulta executada.</strong><span>${c.param ? "Escolha um item e execute." : "Clique em executar."}</span></div></div>`;
      box.querySelector("#qform").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = c.param ? box.querySelector("#qsel").value : null;
        const rota = c.rota(id);
        box.querySelector("#qroute").textContent = `GET ${rota}`;
        const out = box.querySelector("#qresult");
        out.innerHTML = `<div class="loading">Consultando…</div>`;
        try {
          const rows = await api.get(rota);
          box.querySelector("#qcount").textContent = `${rows.length} registro(s)`;
          let html = tableHtml(c.colunas, rows);
          if (c.total && rows.length) html += `<div class="total-bar">${esc(c.total.label)}: <strong>${fmtMoney(rows.reduce((s, r) => s + Number(c.total.get(r) || 0), 0))}</strong></div>`;
          out.innerHTML = html;
        } catch (err) { out.innerHTML = `<div class="alert error">${esc(err.message)}</div>`; }
      });
    }
    root.querySelector(".tabs").addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) show(Number(t.dataset.i)); });
    show(0);
  },
};
