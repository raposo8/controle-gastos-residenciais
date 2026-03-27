using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gastos.Application.DTOs;
using Gastos.Application.Services;
using Gastos.Infrastructure.Data;

namespace Gastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly GastosDbContext _context;
    private readonly TransacaoService _transacaoService;

    public TransacoesController(GastosDbContext context, TransacaoService transacaoService)
    {
        _context = context;
        _transacaoService = transacaoService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var transacoes = await _context.Transacoes
            .Include(t => t.Pessoa)
            .Include(t => t.Categoria)
            .Select(t => new TransacaoResponseDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                CategoriaId = t.CategoriaId,
                CategoriaDescricao = t.Categoria.Descricao,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa.Nome,
                PessoaIdade = t.Pessoa.Idade
            })
            .ToListAsync();

        return Ok(transacoes);
    }
    [HttpPost]
    public async Task<IActionResult> Post(TransacaoRequestDto request)
    {
        try
        {
            var transacao = await _transacaoService.AdicionarTransacaoAsync(request);

            // Mapeia para o DTO antes de retornar
            var response = new TransacaoResponseDto
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                CategoriaId = transacao.CategoriaId,
                CategoriaDescricao = transacao.Categoria?.Descricao ?? string.Empty,
                PessoaId = transacao.PessoaId,
                PessoaNome = transacao.Pessoa?.Nome ?? string.Empty,
                PessoaIdade = transacao.Pessoa?.Idade ?? 0
            };

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { erro = "Erro interno no servidor.", detalhe = ex.Message });
        }
    }
}