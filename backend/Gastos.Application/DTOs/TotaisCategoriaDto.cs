namespace Gastos.Application.DTOs;

public class TotaisCategoriaDto
{
    public string CategoriaDescricao { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal SaldoLiquido => TotalReceitas - TotalDespesas;
}