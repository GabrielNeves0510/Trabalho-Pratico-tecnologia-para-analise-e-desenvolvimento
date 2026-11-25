using LocadoraVeiculos.Data;
using LocadoraVeiculos.DTOs;
using LocadoraVeiculos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraVeiculos.Controllers;

[ApiController, Route("api/[controller]")]
public class FabricantesController : ControllerBase {
 private readonly LocadoraContext c; public FabricantesController(LocadoraContext c)=>this.c=c;
 [HttpGet] public async Task<IActionResult> Get([FromQuery]string? nome,[FromQuery]int? id,[FromQuery]string? possuiVeiculos){var q=c.Fabricantes.AsNoTracking().AsQueryable();if(!string.IsNullOrWhiteSpace(nome))q=q.Where(f=>f.Nome.Contains(nome.Trim()));if(id.HasValue)q=q.Where(f=>f.Id==id.Value);if(possuiVeiculos=="sim")q=q.Where(f=>f.Veiculos.Any());else if(possuiVeiculos=="nao")q=q.Where(f=>!f.Veiculos.Any());return Ok(await q.OrderBy(f=>f.Nome).ToListAsync());}
 [HttpGet("{id:int}")] public async Task<IActionResult> Get(int id){var x=await c.Fabricantes.FindAsync(id);return x==null?NotFound(new{mensagem="Fabricante não encontrado."}):Ok(x);}
 [HttpPost] public async Task<IActionResult> Post(FabricanteDto d){var x=new Fabricante{Nome=d.Nome.Trim()};c.Fabricantes.Add(x);await c.SaveChangesAsync();return CreatedAtAction(nameof(Get),new{id=x.Id},x);}
 [HttpPut("{id:int}")] public async Task<IActionResult> Put(int id,FabricanteDto d){var x=await c.Fabricantes.FindAsync(id);if(x==null)return NotFound();x.Nome=d.Nome.Trim();await c.SaveChangesAsync();return NoContent();}
 [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id){var x=await c.Fabricantes.FindAsync(id);if(x==null)return NotFound();if(await c.Veiculos.AnyAsync(v=>v.FabricanteId==id))return Conflict(new{mensagem="Fabricante possui veículos."});c.Remove(x);await c.SaveChangesAsync();return NoContent();}
}

[ApiController, Route("api/[controller]")]
public class VeiculosController : ControllerBase {
 private readonly LocadoraContext c; public VeiculosController(LocadoraContext c)=>this.c=c;
 [HttpGet] public async Task<IActionResult> Get([FromQuery]string? modelo,[FromQuery]string? placa,[FromQuery]int? fabricanteId,[FromQuery]int? anoMin,[FromQuery]int? anoMax){var q=c.Veiculos.AsNoTracking().Include(v=>v.Fabricante).AsQueryable();if(!string.IsNullOrWhiteSpace(modelo))q=q.Where(v=>v.Modelo.Contains(modelo.Trim()));if(!string.IsNullOrWhiteSpace(placa))q=q.Where(v=>v.Placa.Contains(placa.Trim().ToUpper()));if(fabricanteId.HasValue)q=q.Where(v=>v.FabricanteId==fabricanteId.Value);if(anoMin.HasValue)q=q.Where(v=>v.AnoFabricacao>=anoMin.Value);if(anoMax.HasValue)q=q.Where(v=>v.AnoFabricacao<=anoMax.Value);return Ok(await q.OrderBy(v=>v.Modelo).ToListAsync());}
 [HttpGet("{id:int}")] public async Task<IActionResult> Get(int id){var x=await c.Veiculos.AsNoTracking().Include(v=>v.Fabricante).FirstOrDefaultAsync(v=>v.Id==id);return x==null?NotFound():Ok(x);}
 [HttpPost] public async Task<IActionResult> Post(VeiculoDto d){if(!await c.Fabricantes.AnyAsync(f=>f.Id==d.FabricanteId))return BadRequest(new{mensagem="Fabricante não existe."});var placa=d.Placa.Trim().ToUpper();if(await c.Veiculos.AnyAsync(v=>v.Placa==placa))return Conflict(new{mensagem="Placa já cadastrada."});var x=new Veiculo{FabricanteId=d.FabricanteId,Modelo=d.Modelo.Trim(),AnoFabricacao=d.AnoFabricacao,Quilometragem=d.Quilometragem,Placa=placa};c.Add(x);await c.SaveChangesAsync();return CreatedAtAction(nameof(Get),new{id=x.Id},x);}
 [HttpPut("{id:int}")] public async Task<IActionResult> Put(int id,VeiculoDto d){var x=await c.Veiculos.FindAsync(id);if(x==null)return NotFound();if(!await c.Fabricantes.AnyAsync(f=>f.Id==d.FabricanteId))return BadRequest();var p=d.Placa.Trim().ToUpper();if(await c.Veiculos.AnyAsync(v=>v.Placa==p&&v.Id!=id))return Conflict();x.FabricanteId=d.FabricanteId;x.Modelo=d.Modelo.Trim();x.AnoFabricacao=d.AnoFabricacao;x.Quilometragem=d.Quilometragem;x.Placa=p;await c.SaveChangesAsync();return NoContent();}
 [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id){var x=await c.Veiculos.FindAsync(id);if(x==null)return NotFound();if(await c.Alugueis.AnyAsync(a=>a.VeiculoId==id))return Conflict(new{mensagem="Veículo possui histórico de aluguéis."});c.Remove(x);await c.SaveChangesAsync();return NoContent();}
}

[ApiController, Route("api/[controller]")]
public class ClientesController : ControllerBase {
 private readonly LocadoraContext c; public ClientesController(LocadoraContext c)=>this.c=c;
 [HttpGet] public async Task<IActionResult> Get([FromQuery]string? nome,[FromQuery]string? cpf,[FromQuery]string? email){var q=c.Clientes.AsNoTracking().AsQueryable();if(!string.IsNullOrWhiteSpace(nome))q=q.Where(x=>x.Nome.Contains(nome.Trim()));if(!string.IsNullOrWhiteSpace(cpf))q=q.Where(x=>x.CPF.Contains(cpf.Trim()));if(!string.IsNullOrWhiteSpace(email))q=q.Where(x=>x.Email.Contains(email.Trim()));return Ok(await q.OrderBy(x=>x.Nome).ToListAsync());}
 [HttpGet("{id:int}")] public async Task<IActionResult> Get(int id){var x=await c.Clientes.FindAsync(id);return x==null?NotFound():Ok(x);}
 [HttpPost] public async Task<IActionResult> Post(ClienteDto d){if(await c.Clientes.AnyAsync(x=>x.CPF==d.CPF))return Conflict(new{mensagem="CPF já cadastrado."});if(await c.Clientes.AnyAsync(x=>x.Email==d.Email))return Conflict(new{mensagem="E-mail já cadastrado."});var x=new Cliente{Nome=d.Nome.Trim(),CPF=d.CPF.Trim(),Email=d.Email.Trim().ToLower(),Telefone=d.Telefone.Trim()};c.Add(x);await c.SaveChangesAsync();return CreatedAtAction(nameof(Get),new{id=x.Id},x);}
 [HttpPut("{id:int}")] public async Task<IActionResult> Put(int id,ClienteDto d){var x=await c.Clientes.FindAsync(id);if(x==null)return NotFound();if(await c.Clientes.AnyAsync(y=>y.CPF==d.CPF&&y.Id!=id)||await c.Clientes.AnyAsync(y=>y.Email==d.Email&&y.Id!=id))return Conflict();x.Nome=d.Nome.Trim();x.CPF=d.CPF.Trim();x.Email=d.Email.Trim().ToLower();x.Telefone=d.Telefone.Trim();await c.SaveChangesAsync();return NoContent();}
 [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id){var x=await c.Clientes.FindAsync(id);if(x==null)return NotFound();if(await c.Alugueis.AnyAsync(a=>a.ClienteId==id))return Conflict(new{mensagem="Cliente possui histórico de aluguéis."});c.Remove(x);await c.SaveChangesAsync();return NoContent();}
}

[ApiController, Route("api/[controller]")]
public class AlugueisController : ControllerBase {
 private readonly LocadoraContext c; public AlugueisController(LocadoraContext c)=>this.c=c;
 [HttpGet] public async Task<IActionResult> Get([FromQuery]int? clienteId,[FromQuery]int? veiculoId,[FromQuery]string? status,[FromQuery]DateTime? inicioDe,[FromQuery]DateTime? inicioAte){var q=c.Alugueis.AsNoTracking().Include(a=>a.Cliente).Include(a=>a.Veiculo).ThenInclude(v=>v.Fabricante).AsQueryable();if(clienteId.HasValue)q=q.Where(a=>a.ClienteId==clienteId.Value);if(veiculoId.HasValue)q=q.Where(a=>a.VeiculoId==veiculoId.Value);if(status=="aberto")q=q.Where(a=>a.DataDevolucao==null);else if(status=="encerrado")q=q.Where(a=>a.DataDevolucao!=null);if(inicioDe.HasValue)q=q.Where(a=>a.DataInicio>=inicioDe.Value);if(inicioAte.HasValue)q=q.Where(a=>a.DataInicio<=inicioAte.Value);return Ok(await q.OrderByDescending(a=>a.DataInicio).ToListAsync());}
 [HttpGet("{id:int}")] public async Task<IActionResult> Get(int id){var x=await c.Alugueis.AsNoTracking().Include(a=>a.Cliente).Include(a=>a.Veiculo).Include(a=>a.Pagamentos).FirstOrDefaultAsync(a=>a.Id==id);return x==null?NotFound():Ok(x);}
 [HttpPost] public async Task<IActionResult> Post(AluguelDto d){if(!await c.Clientes.AnyAsync(x=>x.Id==d.ClienteId)||!await c.Veiculos.AnyAsync(x=>x.Id==d.VeiculoId))return BadRequest(new{mensagem="Cliente ou veículo inexistente."});if(d.DataPrevistaDevolucao<=d.DataInicio)return BadRequest(new{mensagem="Data de devolução inválida."});if(d.QuilometragemFinal<d.QuilometragemInicial)return BadRequest(new{mensagem="Quilometragem final inválida."});if(await c.Alugueis.AnyAsync(a=>a.VeiculoId==d.VeiculoId&&a.DataDevolucao==null&&d.DataInicio<a.DataPrevistaDevolucao))return Conflict(new{mensagem="Veículo já alugado no período."});var x=new Aluguel{ClienteId=d.ClienteId,VeiculoId=d.VeiculoId,DataInicio=d.DataInicio,DataPrevistaDevolucao=d.DataPrevistaDevolucao,DataDevolucao=d.DataDevolucao,QuilometragemInicial=d.QuilometragemInicial,QuilometragemFinal=d.QuilometragemFinal,ValorDiaria=d.ValorDiaria,ValorTotal=d.ValorTotal};c.Add(x);await c.SaveChangesAsync();return CreatedAtAction(nameof(Get),new{id=x.Id},x);}
 [HttpPut("{id:int}")] public async Task<IActionResult> Put(int id,AluguelDto d){var x=await c.Alugueis.FindAsync(id);if(x==null)return NotFound();if(d.DataPrevistaDevolucao<=d.DataInicio)return BadRequest();x.ClienteId=d.ClienteId;x.VeiculoId=d.VeiculoId;x.DataInicio=d.DataInicio;x.DataPrevistaDevolucao=d.DataPrevistaDevolucao;x.DataDevolucao=d.DataDevolucao;x.QuilometragemInicial=d.QuilometragemInicial;x.QuilometragemFinal=d.QuilometragemFinal;x.ValorDiaria=d.ValorDiaria;x.ValorTotal=d.ValorTotal;await c.SaveChangesAsync();return NoContent();}
 [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id){var x=await c.Alugueis.FindAsync(id);if(x==null)return NotFound();c.Remove(x);await c.SaveChangesAsync();return NoContent();}
}

[ApiController, Route("api/[controller]")]
public class PagamentosController : ControllerBase {
 private readonly LocadoraContext c; public PagamentosController(LocadoraContext c)=>this.c=c;
 [HttpGet] public async Task<IActionResult> Get([FromQuery]int? aluguelId,[FromQuery]string? formaPagamento,[FromQuery]DateTime? dataDe,[FromQuery]DateTime? dataAte){var q=c.Pagamentos.AsNoTracking().Include(p=>p.Aluguel).AsQueryable();if(aluguelId.HasValue)q=q.Where(p=>p.AluguelId==aluguelId.Value);if(!string.IsNullOrWhiteSpace(formaPagamento))q=q.Where(p=>p.FormaPagamento.Contains(formaPagamento.Trim()));if(dataDe.HasValue)q=q.Where(p=>p.DataPagamento>=dataDe.Value);if(dataAte.HasValue)q=q.Where(p=>p.DataPagamento<=dataAte.Value);return Ok(await q.OrderByDescending(p=>p.DataPagamento).ToListAsync());}
 [HttpGet("{id:int}")] public async Task<IActionResult> Get(int id){var x=await c.Pagamentos.AsNoTracking().Include(p=>p.Aluguel).FirstOrDefaultAsync(p=>p.Id==id);return x==null?NotFound():Ok(x);}
 [HttpPost] public async Task<IActionResult> Post(PagamentoDto d){if(!await c.Alugueis.AnyAsync(a=>a.Id==d.AluguelId))return BadRequest();var x=new Pagamento{AluguelId=d.AluguelId,DataPagamento=d.DataPagamento,Valor=d.Valor,FormaPagamento=d.FormaPagamento.Trim()};c.Add(x);await c.SaveChangesAsync();return CreatedAtAction(nameof(Get),new{id=x.Id},x);}
 [HttpPut("{id:int}")] public async Task<IActionResult> Put(int id,PagamentoDto d){var x=await c.Pagamentos.FindAsync(id);if(x==null)return NotFound();x.AluguelId=d.AluguelId;x.DataPagamento=d.DataPagamento;x.Valor=d.Valor;x.FormaPagamento=d.FormaPagamento.Trim();await c.SaveChangesAsync();return NoContent();}
 [HttpDelete("{id:int}")] public async Task<IActionResult> Delete(int id){var x=await c.Pagamentos.FindAsync(id);if(x==null)return NotFound();c.Remove(x);await c.SaveChangesAsync();return NoContent();}
}
