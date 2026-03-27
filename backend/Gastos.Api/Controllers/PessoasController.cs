using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gastos.Domain.Entities;
using Gastos.Infrastructure.Data;

namespace Gastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly GastosDbContext _context;
    private readonly ILogger<PessoasController> _logger;

    public PessoasController(GastosDbContext context, ILogger<PessoasController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            return Ok(pessoas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter lista de pessoas.");
            return StatusCode(500, "Erro interno ao processar a solicitação.");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Pessoa pessoa)
    {
        if (pessoa == null)
            return BadRequest("Dados da pessoa não informados.");

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = pessoa.Id }, pessoa);
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("UNIQUE") == true)
        {
            _logger.LogError(ex, "Violação de chave única ao criar pessoa.");
            return Conflict("Já existe uma pessoa com os mesmos dados.");
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Erro ao salvar pessoa no banco.");
            return StatusCode(500, "Erro ao salvar pessoa.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado ao criar pessoa.");
            return StatusCode(500, "Erro interno ao processar a solicitação.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Pessoa pessoa)
    {
        if (pessoa == null)
            return BadRequest("Dados da pessoa não informados.");

        if (id != pessoa.Id)
            return BadRequest("IDs incompatíveis.");

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var existing = await _context.Pessoas.FindAsync(id);
            if (existing == null)
                return NotFound($"Pessoa com ID {id} não encontrada.");

            _context.Entry(existing).CurrentValues.SetValues(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            _logger.LogError(ex, "Conflito de concorrência ao atualizar pessoa ID {Id}.", id);
            return Conflict("Os dados foram modificados por outro usuário. Tente novamente.");
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Erro ao atualizar pessoa ID {Id}.", id);
            return StatusCode(500, "Erro ao atualizar pessoa.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado ao atualizar pessoa ID {Id}.", id);
            return StatusCode(500, "Erro interno ao processar a solicitação.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
                return NotFound($"Pessoa com ID {id} não encontrada.");

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateException ex)
        {
            // Pode ser violação de chave estrangeira (ex: a pessoa tem transações mesmo com cascade, mas pode haver constraint no banco)
            _logger.LogError(ex, "Erro ao excluir pessoa ID {Id}.", id);
            return StatusCode(500, "Não foi possível excluir a pessoa devido a dependências.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado ao excluir pessoa ID {Id}.", id);
            return StatusCode(500, "Erro interno ao processar a solicitação.");
        }
    }
}