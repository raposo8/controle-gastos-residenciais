
using Gastos.Domain.Enums;

namespace Gastos.Application.DTOs;

public class TransacaoResponseDto
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; } // 1 = Despesa, 2 = Receita
    public int CategoriaId { get; set; }
    public string CategoriaDescricao { get; set; } = string.Empty;
    public int PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
    public int PessoaIdade { get; set; }
}