using Microsoft.AspNetCore.Mvc;
using Gastos.Application.Services;

namespace Gastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly TransacaoService _transacaoService;

    public RelatoriosController(TransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpGet("totais-por-pessoa")]
    public async Task<IActionResult> GetTotaisPorPessoa()
    {
        var totais = await _transacaoService.ObterTotaisPorPessoaAsync();
        return Ok(totais);
    }

    [HttpGet("totais-por-categoria")]
    public async Task<IActionResult> GetTotaisPorCategoria()
    {
        var totais = await _transacaoService.ObterTotaisPorCategoriaAsync();
        return Ok(totais);
    }
}