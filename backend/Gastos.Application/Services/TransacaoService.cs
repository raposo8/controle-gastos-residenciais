using Gastos.Application.DTOs;
using Gastos.Domain.Entities;
using Gastos.Domain.Enums;
using Gastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Application.Services;

public class TransacaoService
{
    private readonly GastosDbContext _context;

    public TransacaoService(GastosDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Adiciona uma nova transação aplicando as regras de negócio de idade e categoria.
    /// </summary>
    public async Task<Transacao> AdicionarTransacaoAsync(TransacaoRequestDto request)
    {
        var pessoa = await _context.Pessoas.FindAsync(request.PessoaId);
        if (pessoa == null) throw new Exception("Pessoa não encontrada.");

        var categoria = await _context.Categorias.FindAsync(request.CategoriaId);
        if (categoria == null) throw new Exception("Categoria não encontrada.");

        // Regra 1: Menores de 18 anos só podem registrar despesas
        if (pessoa.Idade < 18 && request.Tipo != TipoTransacao.Despesa)
        {
            throw new ArgumentException("Menores de idade só podem registrar despesas.");
        }

        // Regra 2: O tipo da transação deve respeitar a finalidade da categoria
        if (categoria.Finalidade == Finalidade.Despesa && request.Tipo == TipoTransacao.Receita)
        {
            throw new ArgumentException("Esta categoria não permite receitas, apenas despesas.");
        }

        if (categoria.Finalidade == Finalidade.Receita && request.Tipo == TipoTransacao.Despesa)
        {
            throw new ArgumentException("Esta categoria não permite despesas, apenas receitas.");
        }

        // Regra 3: Valor deve ser positivo
        if (request.Valor <= 0)
        {
            throw new ArgumentException("O valor da transação deve ser estritamente positivo.");
        }

        var novaTransacao = new Transacao
        {
            Descricao = request.Descricao,
            Valor = request.Valor,
            Tipo = request.Tipo,
            CategoriaId = request.CategoriaId,
            PessoaId = request.PessoaId
        };

        _context.Transacoes.Add(novaTransacao);
        await _context.SaveChangesAsync();

        return novaTransacao;
    }

    /// <summary>
    /// Retorna o relatório de totais agrupado por pessoa, calculando o saldo líquido.
    /// </summary>
    public async Task<List<TotaisPessoaDto>> ObterTotaisPorPessoaAsync()
    {
        return await _context.Pessoas
            .Include(p => p.Transacoes) // Precisamos incluir as transações para somar
            .Select(p => new TotaisPessoaDto
            {
                PessoaNome = p.Nome,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            })
            .ToListAsync();
    }

    /// <summary>
    /// Retorna o relatório de totais agrupado por categoria (Requisito Opcional).
    /// </summary>
    public async Task<List<TotaisCategoriaDto>> ObterTotaisPorCategoriaAsync()
    {
        return await _context.Categorias
            .Select(c => new TotaisCategoriaDto
            {
                CategoriaDescricao = c.Descricao,
                TotalReceitas = _context.Transacoes
                    .Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor),
                TotalDespesas = _context.Transacoes
                    .Where(t => t.CategoriaId == c.Id && t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor)
            })
            .ToListAsync();
    }
}