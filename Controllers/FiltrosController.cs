using LocadoraVeiculos.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace LocadoraVeiculos.Controllers;
[ApiController, Route("api/[controller]")]
public class FiltrosController : ControllerBase {
 private readonly LocadoraContext c; public FiltrosController(LocadoraContext c)=>this.c=c;
 [HttpGet("veiculos-por-fabricante/{fabricanteId:int}")] public async Task<IActionResult> VPF(int fabricanteId)=>Ok(await c.Veiculos.Where(v=>v.FabricanteId==fabricanteId).Select(v=>new{v.Id,v.Modelo,v.AnoFabricacao,v.Quilometragem,v.Placa,Fabricante=v.Fabricante.Nome}).ToListAsync());
 [HttpGet("alugueis-por-cliente/{clienteId:int}")] public async Task<IActionResult> APC(int clienteId)=>Ok(await c.Alugueis.Where(a=>a.ClienteId==clienteId).Select(a=>new{a.Id,Cliente=a.Cliente.Nome,Veiculo=a.Veiculo.Modelo,a.DataInicio,a.DataDevolucao,a.ValorTotal}).ToListAsync());
 [HttpGet("veiculos-alugados")] public async Task<IActionResult> VA()=>Ok(await c.Alugueis.Where(a=>a.DataDevolucao==null).Select(a=>new{VeiculoId=a.VeiculoId,Veiculo=a.Veiculo.Modelo,Placa=a.Veiculo.Placa,Cliente=a.Cliente.Nome,a.DataInicio,a.DataPrevistaDevolucao}).ToListAsync());
 [HttpGet("pagamentos-por-aluguel/{aluguelId:int}")] public async Task<IActionResult> PPA(int aluguelId)=>Ok(await c.Pagamentos.Where(p=>p.AluguelId==aluguelId).Select(p=>new{p.Id,p.DataPagamento,p.Valor,p.FormaPagamento,Cliente=p.Aluguel.Cliente.Nome}).ToListAsync());
 [HttpGet("alugueis-por-fabricante/{fabricanteId:int}")] public async Task<IActionResult> APF(int fabricanteId)=>Ok(await c.Alugueis.Where(a=>a.Veiculo.FabricanteId==fabricanteId).Select(a=>new{a.Id,Fabricante=a.Veiculo.Fabricante.Nome,Veiculo=a.Veiculo.Modelo,Placa=a.Veiculo.Placa,Cliente=a.Cliente.Nome,a.DataInicio,a.DataDevolucao,a.ValorTotal}).ToListAsync());
}
