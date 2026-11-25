import { api } from "./api.js";
import dashboard from "./pages/dashboard.js";
import consultas from "./pages/consultas.js";
import { fabricantes, veiculos, clientes, alugueis, pagamentos } from "./pages/entities.js";

const routes = { dashboard, fabricantes, veiculos, clientes, alugueis, pagamentos, consultas };
const main = document.getElementById("main");

async function navigate() {
  const key = (location.hash.replace(/^#\/?/, "") || "dashboard").split("?")[0];
  const page = routes[key] || dashboard;
  document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#/${routes[key] ? key : "dashboard"}`));
  document.title = `${page.title} · Locadora de Veículos`;
  main.focus({ preventScroll: true });
  await page.render(main);
  window.scrollTo(0, 0);
}

async function checkApi() {
  const el = document.getElementById("api-status");
  try { await api.get("/api/Fabricantes"); el.className = "api-status on"; el.textContent = "API conectada"; }
  catch { el.className = "api-status off"; el.textContent = "API offline"; }
}

document.getElementById("menu-btn").addEventListener("click", () => document.body.classList.toggle("nav-open"));
document.querySelector("nav").addEventListener("click", () => document.body.classList.remove("nav-open"));
window.addEventListener("hashchange", () => { navigate(); checkApi(); });
navigate();
checkApi();
