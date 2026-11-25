import { api } from "../api.js";
import { esc, fmtDate, fmtMoney, tableHtml } from "../ui.js";

export default {
  title: "Painel",
  async render(root) {
    root.innerHTML = `<div class="page-head"><div><h1>Painel</h1><p class="muted">Visão geral da locadora.</p></div></div><div class="loading">Carregando…</div>`;
    try {
      const [fab, vei, cli, alu, pag, abertos] = await Promise.all([
        api.get("/api/Fabricantes"), api.get("/api/Veiculos"), api.get("/api/Clientes"),
        api.get("/api/Alugueis"), api.get("/api/Pagamentos"), api.get("/api/Filtros/veiculos-alugados"),
      ]);
      const receita = pag.reduce((s, p) => s + Number(p.valor), 0);
      const cards = [
        ["Veículos na frota", vei.length, `${fab.length} fabricantes`, "#/veiculos"],
        ["Alugados agora", abertos.length, `${Math.max(vei.length - abertos.length, 0)} disponíveis`, "#/consultas"],
        ["Clientes", cli.length, `${alu.length} aluguéis no total`, "#/clientes"],
        ["Recebido", fmtMoney(receita), `${pag.length} pagamentos`, "#/pagamentos"],
      ];
      root.innerHTML = `
        <div class="page-head"><div><h1>Painel</h1><p class="muted">Visão geral da locadora, em tempo real a partir da API.</p></div></div>
        <div class="stats">${cards.map(([t, v, s, href]) => `<a class="stat" href="${href}"><span>${esc(t)}</span><strong>${esc(v)}</strong><small>${esc(s)}</small></a>`).join("")}</div>
        <div class="card"><h2>Veículos alugados agora</h2>
          <p class="muted">Rota <code>GET /api/Filtros/veiculos-alugados</code></p>
          ${tableHtml([
            { label: "Veículo", render: (r) => `<strong>${esc(r.veiculo)}</strong>` },
            { label: "Placa", render: (r) => `<span class="plate">${esc(r.placa)}</span>` },
            { label: "Cliente", render: (r) => esc(r.cliente) },
            { label: "Início", render: (r) => fmtDate(r.dataInicio) },
            { label: "Devolução prevista", render: (r) => fmtDate(r.dataPrevistaDevolucao) },
          ], abertos)}</div>
        <div class="card"><h2>Últimos aluguéis</h2>
          ${tableHtml([
            { label: "ID", render: (r) => `#${r.id}` },
            { label: "Cliente", render: (r) => esc(r.cliente?.nome) },
            { label: "Veículo", render: (r) => esc(r.veiculo?.modelo) },
            { label: "Início", render: (r) => fmtDate(r.dataInicio) },
            { label: "Total", align: "right", render: (r) => fmtMoney(r.valorTotal) },
          ], alu.slice(0, 5))}</div>`;
    } catch (e) {
      root.querySelector(".loading").outerHTML = `<div class="alert error">${esc(e.message)}</div>`;
    }
  },
};
