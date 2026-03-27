namespace Gastos.Application.DTOs;

public class TotaisPessoaDto
{
    public string PessoaNome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal SaldoLiquido => TotalReceitas - TotalDespesas;
}