import { createCrudPage } from "../crud.js";
import { esc, fmtDate, fmtMoney, fmtKm, fmtCpf, toInputDate } from "../ui.js";
import { fabricanteOptions, clienteOptions, veiculoOptions, aluguelOptions } from "../lookups.js";

const num = (v) => (v === "" || v === undefined ? null : Number(v));
const FORMAS = ["PIX", "Cartão de crédito", "Cartão de débito", "Dinheiro", "Boleto"];

/* ---------------- Fabricantes ---------------- */
export const fabricantes = createCrudPage({
  title: "Fabricantes", subtitle: "Marcas dos veículos da frota.", singular: "fabricante", newLabel: "Novo fabricante",
  endpoint: "/api/Fabricantes",
  columns: [
    { label: "ID", render: (r) => r.id },
    { label: "Nome", render: (r) => `<strong>${esc(r.nome)}</strong>` },
  ],
  filters: [
    { param: "nome", label: "Nome", placeholder: "Ex.: Fiat" },
    { param: "id", label: "Código (ID)", type: "number", min: 1, placeholder: "Ex.: 3" },
    { param: "possuiVeiculos", label: "Possui veículos?", type: "select", choices: [{ value: "sim", label: "Sim" }, { value: "nao", label: "Não" }] },
  ],
  fields: [{ name: "nome", label: "Nome", required: true, maxlength: 100, span: 2 }],
  toForm: (r) => ({ nome: r.nome }),
  toPayload: (v) => ({ nome: v.nome.trim() }),
  describe: (r) => `o fabricante "${r.nome}"`,
});

/* ---------------- Veículos ---------------- */
export const veiculos = createCrudPage({
  title: "Veículos", subtitle: "Frota disponível para locação.", singular: "veículo", newLabel: "Novo veículo",
  endpoint: "/api/Veiculos",
  columns: [
    { label: "ID", render: (r) => r.id },
    { label: "Modelo", render: (r) => `<strong>${esc(r.modelo)}</strong>` },
    { label: "Fabricante", render: (r) => esc(r.fabricante?.nome ?? "—") },
    { label: "Ano", render: (r) => r.anoFabricacao },
    { label: "Placa", render: (r) => `<span class="plate">${esc(r.placa)}</span>` },
    { label: "Quilometragem", align: "right", render: (r) => fmtKm(r.quilometragem) },
  ],
  filters: [
    { param: "modelo", label: "Modelo", placeholder: "Ex.: Uno" },
    { param: "placa", label: "Placa", placeholder: "Ex.: ABC" },
    { param: "fabricanteId", label: "Fabricante", type: "select", options: fabricanteOptions },
    { param: "anoMin", label: "Ano de", type: "number", min: 1900, placeholder: "2015" },
    { param: "anoMax", label: "Ano até", type: "number", min: 1900, placeholder: "2025" },
  ],
  fields: [
    { name: "fabricanteId", label: "Fabricante", type: "select", required: true, options: fabricanteOptions },
    { name: "modelo", label: "Modelo", required: true, maxlength: 100 },
    { name: "anoFabricacao", label: "Ano de fabricação", type: "number", required: true, min: 1900, max: 2100 },
    { name: "quilometragem", label: "Quilometragem (km)", type: "number", required: true, min: 0, step: "0.01" },
    { name: "placa", label: "Placa", required: true, maxlength: 10, placeholder: "ABC1D23", hint: "Deve ser única na frota." },
  ],
  toForm: (r) => ({ fabricanteId: r.fabricanteId, modelo: r.modelo, anoFabricacao: r.anoFabricacao, quilometragem: r.quilometragem, placa: r.placa }),
  toPayload: (v) => ({
    fabricanteId: Number(v.fabricanteId), modelo: v.modelo.trim(), anoFabricacao: Number(v.anoFabricacao),
    quilometragem: Number(v.quilometragem), placa: v.placa.trim().toUpperCase(),
  }),
  describe: (r) => `o veículo ${r.modelo} (${r.placa})`,
});

/* ---------------- Clientes ---------------- */
export const clientes = createCrudPage({
  title: "Clientes", subtitle: "Pessoas que alugam veículos.", singular: "cliente", newLabel: "Novo cliente",
  endpoint: "/api/Clientes",
  columns: [
    { label: "ID", render: (r) => r.id },
    { label: "Nome", render: (r) => `<strong>${esc(r.nome)}</strong>` },
    { label: "CPF", render: (r) => esc(fmtCpf(r.cpf)) },
    { label: "E-mail", render: (r) => esc(r.email) },
    { label: "Telefone", render: (r) => esc(r.telefone || "—") },
  ],
  filters: [
    { param: "nome", label: "Nome", placeholder: "Ex.: Maria" },
    { param: "cpf", label: "CPF", placeholder: "Somente números" },
    { param: "email", label: "E-mail", placeholder: "Ex.: @gmail" },
  ],
  fields: [
    { name: "nome", label: "Nome completo", required: true, maxlength: 150, span: 2 },
    { name: "cpf", label: "CPF", required: true, minlength: 11, maxlength: 11, pattern: "\\d{11}", inputmode: "numeric", placeholder: "11 dígitos, sem pontuação" },
    { name: "telefone", label: "Telefone", required: true, maxlength: 20, placeholder: "(31) 99999-0000" },
    { name: "email", label: "E-mail", type: "email", required: true, maxlength: 150, span: 2 },
  ],
  toForm: (r) => ({ nome: r.nome, cpf: r.cpf, telefone: r.telefone, email: r.email }),
  toPayload: (v) => ({ nome: v.nome.trim(), cpf: v.cpf.replace(/\D/g, ""), email: v.email.trim(), telefone: v.telefone.trim() }),
  describe: (r) => `o cliente ${r.nome}`,
});

/* ---------------- Aluguéis ---------------- */
function autoTotal(form, ctx) {
  const $ = (n) => form.elements[n];
  const total = $("valorTotal");
  total.addEventListener("input", () => { total.dataset.touched = "1"; });
  const recalc = () => {
    if (total.dataset.touched) return;
    const ini = $("dataInicio").value, fim = $("dataPrevistaDevolucao").value, d = Number($("valorDiaria").value);
    if (!ini || !fim || !d) return;
    const dias = Math.ceil((new Date(fim) - new Date(ini)) / 86400000);
    if (dias > 0) total.value = (dias * d).toFixed(2);
  };
  ["dataInicio", "dataPrevistaDevolucao", "valorDiaria"].forEach((n) => $(n).addEventListener("input", recalc));
  if (!ctx.row) {
    $("veiculoId").addEventListener("change", () => {
      const v = ctx.options.veiculoId.find((o) => String(o.value) === $("veiculoId").value);
      if (v && !$("quilometragemInicial").value) $("quilometragemInicial").value = v.data.quilometragem;
    });
  }
}

export const alugueis = createCrudPage({
  title: "Aluguéis", subtitle: "Locações de veículos por clientes.", singular: "aluguel", newLabel: "Novo aluguel",
  endpoint: "/api/Alugueis",
  columns: [
    { label: "ID", render: (r) => r.id },
    { label: "Cliente", render: (r) => `<strong>${esc(r.cliente?.nome ?? "—")}</strong>` },
    { label: "Veículo", render: (r) => `${esc(r.veiculo?.modelo ?? "—")} <span class="plate">${esc(r.veiculo?.placa ?? "")}</span>` },
    { label: "Início", render: (r) => fmtDate(r.dataInicio) },
    { label: "Prev. devolução", render: (r) => fmtDate(r.dataPrevistaDevolucao) },
    { label: "Situação", render: (r) => r.dataDevolucao ? `<span class="badge ok">Devolvido em ${fmtDate(r.dataDevolucao)}</span>` : `<span class="badge warn">Em aberto</span>` },
    { label: "Diária", align: "right", render: (r) => fmtMoney(r.valorDiaria) },
    { label: "Total", align: "right", render: (r) => `<strong>${fmtMoney(r.valorTotal)}</strong>` },
  ],
  filters: [
    { param: "clienteId", label: "Cliente", type: "select", options: clienteOptions },
    { param: "veiculoId", label: "Veículo", type: "select", options: veiculoOptions },
    { param: "status", label: "Situação", type: "select", choices: [{ value: "aberto", label: "Em aberto" }, { value: "encerrado", label: "Devolvidos" }] },
    { param: "inicioDe", label: "Início a partir de", type: "date" },
    { param: "inicioAte", label: "Início até", type: "date" },
  ],
  fields: [
    { name: "clienteId", label: "Cliente", type: "select", required: true, options: clienteOptions },
    { name: "veiculoId", label: "Veículo", type: "select", required: true, options: veiculoOptions },
    { name: "dataInicio", label: "Data de início", type: "date", required: true },
    { name: "dataPrevistaDevolucao", label: "Devolução prevista", type: "date", required: true, hint: "Deve ser posterior ao início." },
    { name: "dataDevolucao", label: "Data da devolução", type: "date", hint: "Deixe em branco se o veículo ainda está alugado." },
    { name: "quilometragemInicial", label: "Km inicial", type: "number", required: true, min: 0, step: "0.01" },
    { name: "quilometragemFinal", label: "Km final", type: "number", min: 0, step: "0.01", hint: "Preencha na devolução." },
    { name: "valorDiaria", label: "Valor da diária (R$)", type: "number", required: true, min: 0, step: "0.01" },
    { name: "valorTotal", label: "Valor total (R$)", type: "number", required: true, min: 0, step: "0.01", hint: "Calculado: dias × diária (editável)." },
  ],
  afterRender: autoTotal,
  toForm: (r) => ({
    clienteId: r.clienteId, veiculoId: r.veiculoId, dataInicio: toInputDate(r.dataInicio),
    dataPrevistaDevolucao: toInputDate(r.dataPrevistaDevolucao), dataDevolucao: toInputDate(r.dataDevolucao),
    quilometragemInicial: r.quilometragemInicial, quilometragemFinal: r.quilometragemFinal ?? "",
    valorDiaria: r.valorDiaria, valorTotal: r.valorTotal,
  }),
  toPayload: (v) => ({
    clienteId: Number(v.clienteId), veiculoId: Number(v.veiculoId),
    dataInicio: `${v.dataInicio}T00:00:00`, dataPrevistaDevolucao: `${v.dataPrevistaDevolucao}T00:00:00`,
    dataDevolucao: v.dataDevolucao ? `${v.dataDevolucao}T00:00:00` : null,
    quilometragemInicial: Number(v.quilometragemInicial), quilometragemFinal: num(v.quilometragemFinal),
    valorDiaria: Number(v.valorDiaria), valorTotal: Number(v.valorTotal),
  }),
  describe: (r) => `o aluguel #${r.id} de ${r.cliente?.nome ?? "cliente"}`,
});

/* ---------------- Pagamentos ---------------- */
export const pagamentos = createCrudPage({
  title: "Pagamentos", subtitle: "Pagamentos registrados por aluguel.", singular: "pagamento", newLabel: "Novo pagamento",
  endpoint: "/api/Pagamentos",
  columns: [
    { label: "ID", render: (r) => r.id },
    { label: "Aluguel", render: (r) => `#${r.aluguelId}` },
    { label: "Data", render: (r) => fmtDate(r.dataPagamento) },
    { label: "Forma", render: (r) => `<span class="badge">${esc(r.formaPagamento)}</span>` },
    { label: "Valor", align: "right", render: (r) => `<strong>${fmtMoney(r.valor)}</strong>` },
  ],
  filters: [
    { param: "aluguelId", label: "Aluguel", type: "select", options: aluguelOptions },
    { param: "formaPagamento", label: "Forma de pagamento", type: "select", choices: FORMAS.map((f) => ({ value: f, label: f })) },
    { param: "dataDe", label: "Pago a partir de", type: "date" },
    { param: "dataAte", label: "Pago até", type: "date" },
  ],
  fields: [
    { name: "aluguelId", label: "Aluguel", type: "select", required: true, options: aluguelOptions, span: 2 },
    { name: "dataPagamento", label: "Data do pagamento", type: "date", required: true },
    { name: "valor", label: "Valor (R$)", type: "number", required: true, min: 0.01, step: "0.01" },
    { name: "formaPagamento", label: "Forma de pagamento", type: "select-static", choices: FORMAS, required: true, span: 2 },
  ],
  toForm: (r) => ({ aluguelId: r.aluguelId, dataPagamento: toInputDate(r.dataPagamento), valor: r.valor, formaPagamento: r.formaPagamento }),
  toPayload: (v) => ({ aluguelId: Number(v.aluguelId), dataPagamento: `${v.dataPagamento}T00:00:00`, valor: Number(v.valor), formaPagamento: v.formaPagamento }),
  describe: (r) => `o pagamento #${r.id} de ${fmtMoney(r.valor)}`,
});
