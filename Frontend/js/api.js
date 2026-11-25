import { API_BASE } from "./config.js";

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

// Converte a resposta de erro da API (mensagem, ProblemDetails ou validação) em texto legível.
function extractMessage(data, status) {
  if (data && data.mensagem) return data.mensagem;
  if (data && data.errors) return Object.values(data.errors).flat().join(" ");
  if (data && data.title) return data.title;
  const padrao = {
    400: "Dados inválidos. Revise os campos e tente novamente.",
    404: "Registro não encontrado.",
    409: "Operação não permitida: conflito com outro registro.",
    500: "Erro interno no servidor.",
  };
  return padrao[status] || `Falha na requisição (HTTP ${status}).`;
}

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : {},
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API. Verifique se o back-end está em execução.", 0);
  }
  if (res.status === 204) return null;
  let data = null;
  try { data = await res.json(); } catch { /* corpo vazio */ }
  if (!res.ok) throw new ApiError(extractMessage(data, res.status), res.status);
  return data;
}

// Monta query string ignorando valores vazios.
export function qs(params = {}) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") u.set(k, String(v).trim());
  });
  const s = u.toString();
  return s ? `?${s}` : "";
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  del: (path) => request("DELETE", path),
};
