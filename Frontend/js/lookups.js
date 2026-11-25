// Carregadores de opções (selects) alimentados pela API.
import { api } from "./api.js";
import { fmtDate } from "./ui.js";

export const fabricanteOptions = async () =>
  (await api.get("/api/Fabricantes")).map((f) => ({ value: f.id, label: f.nome }));

export const clienteOptions = async () =>
  (await api.get("/api/Clientes")).map((c) => ({ value: c.id, label: c.nome }));

export const veiculoOptions = async () =>
  (await api.get("/api/Veiculos")).map((v) => ({
    value: v.id, label: `${v.modelo} — ${v.placa}`, data: { quilometragem: v.quilometragem },
  }));

export const aluguelOptions = async () =>
  (await api.get("/api/Alugueis")).map((a) => ({
    value: a.id,
    label: `#${a.id} — ${a.cliente?.nome ?? "Cliente " + a.clienteId} · ${a.veiculo?.modelo ?? "Veículo " + a.veiculoId} (${fmtDate(a.dataInicio)})`,
  }));
