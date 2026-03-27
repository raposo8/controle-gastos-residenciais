using Microsoft.EntityFrameworkCore;
using Gastos.Domain.Entities;

namespace Gastos.Infrastructure.Data;

public class GastosDbContext : DbContext
{
    public GastosDbContext(DbContextOptions<GastosDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //Ao deletar uma pessoa, deleta as transações dela em cascata
        modelBuilder.Entity<Pessoa>()
            .HasMany(p => p.Transacoes)
            .WithOne(t => t.Pessoa)
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}