using LocadoraVeiculos.Models;
using Microsoft.EntityFrameworkCore;

namespace LocadoraVeiculos.Data;

public class LocadoraContext : DbContext
{
    public LocadoraContext(DbContextOptions<LocadoraContext> options)
        : base(options)
    {
    }

    public DbSet<Fabricante> Fabricantes => Set<Fabricante>();
    public DbSet<Veiculo> Veiculos => Set<Veiculo>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Aluguel> Alugueis => Set<Aluguel>();
    public DbSet<Pagamento> Pagamentos => Set<Pagamento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Fabricante>(entity =>
        {
            entity.HasKey(f => f.Id);
            entity.Property(f => f.Nome)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<Veiculo>(entity =>
        {
            entity.HasKey(v => v.Id);

            entity.Property(v => v.Modelo)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(v => v.Placa)
                .IsRequired()
                .HasMaxLength(10);

            entity.Property(v => v.Quilometragem)
                .HasPrecision(10, 2);

            entity.HasIndex(v => v.Placa)
                .IsUnique();

            entity.HasOne(v => v.Fabricante)
                .WithMany(f => f.Veiculos)
                .HasForeignKey(v => v.FabricanteId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Nome)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(c => c.CPF)
                .IsRequired()
                .HasMaxLength(11);

            entity.Property(c => c.Email)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(c => c.Telefone)
                .HasMaxLength(20);

            entity.HasIndex(c => c.CPF)
                .IsUnique();

            entity.HasIndex(c => c.Email)
                .IsUnique();
        });

        modelBuilder.Entity<Aluguel>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.Property(a => a.QuilometragemInicial)
                .HasPrecision(10, 2);

            entity.Property(a => a.QuilometragemFinal)
                .HasPrecision(10, 2);

            entity.Property(a => a.ValorDiaria)
                .HasPrecision(10, 2);

            entity.Property(a => a.ValorTotal)
                .HasPrecision(10, 2);

            entity.HasOne(a => a.Cliente)
                .WithMany(c => c.Alugueis)
                .HasForeignKey(a => a.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Veiculo)
                .WithMany(v => v.Alugueis)
                .HasForeignKey(a => a.VeiculoId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Pagamento>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Valor)
                .HasPrecision(10, 2);

            entity.Property(p => p.FormaPagamento)
                .IsRequired()
                .HasMaxLength(30);

            entity.HasOne(p => p.Aluguel)
                .WithMany(a => a.Pagamentos)
                .HasForeignKey(p => p.AluguelId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
