using Gastos.Domain.Enums;

namespace Gastos.Application.DTOs;

public class TransacaoRequestDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public int CategoriaId { get; set; }
    public int PessoaId { get; set; }
}