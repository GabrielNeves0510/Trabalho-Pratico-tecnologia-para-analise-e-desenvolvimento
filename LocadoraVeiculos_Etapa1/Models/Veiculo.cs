namespace LocadoraVeiculos.Models;

public class Veiculo
{
    public int Id { get; set; }
    public int FabricanteId { get; set; }
    public string Modelo { get; set; } = string.Empty;
    public int AnoFabricacao { get; set; }
    public decimal Quilometragem { get; set; }
    public string Placa { get; set; } = string.Empty;

    public Fabricante Fabricante { get; set; } = null!;
    public ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
}
