namespace LocadoraVeiculos.Models;

public class Pagamento
{
    public int Id { get; set; }
    public int AluguelId { get; set; }
    public DateTime DataPagamento { get; set; }
    public decimal Valor { get; set; }
    public string FormaPagamento { get; set; } = string.Empty;

    public Aluguel Aluguel { get; set; } = null!;
}
