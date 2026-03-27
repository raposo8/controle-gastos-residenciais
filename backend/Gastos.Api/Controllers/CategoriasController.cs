using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gastos.Domain.Entities;
using Gastos.Infrastructure.Data;

namespace Gastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly GastosDbContext _context;

    public CategoriasController(GastosDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _context.Categorias.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Post(Categoria categoria)
    {
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = categoria.Id }, categoria);
    }
}