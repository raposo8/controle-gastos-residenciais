using Gastos.Application.DTOs;
using Gastos.Application.Services;
using Gastos.Domain.Entities;
using Gastos.Domain.Enums;
using Gastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Tests;

public class TransacaoServiceTests
{
    // Método auxiliar para criar um banco em memória zerado para cada teste
    private GastosDbContext CriarContextoEmMemoria()
    {
        var options = new DbContextOptionsBuilder<GastosDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new GastosDbContext(options);
    }

    [Fact]
    public async Task AdicionarTransacao_MenorDeIdadeTentandoRegistrarReceita_DeveLancarExcecao()
    {
        // Arrange 
        var context = CriarContextoEmMemoria();
        var pessoa = new Pessoa { Nome = "Joãozinho", Idade = 17 };
        var categoria = new Categoria { Descricao = "Mesada", Finalidade = Finalidade.Ambas };

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);
        var request = new TransacaoRequestDto
        {
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id,
            Valor = 100,
            Tipo = TipoTransacao.Receita, 
            Descricao = "Ganhando mesada"
        };

        // Act & Assert (Ação e Validação)
        var excecao = await Assert.ThrowsAsync<ArgumentException>(() => service.AdicionarTransacaoAsync(request));
        Assert.Equal("Menores de idade só podem registrar despesas.", excecao.Message);
    }

    [Fact]
    public async Task AdicionarTransacao_CategoriaIncompativelComTipo_DeveLancarExcecao()
    {
        // Arrange
        var context = CriarContextoEmMemoria();
        var pessoa = new Pessoa { Nome = "Victor", Idade = 25 };
        var categoria = new Categoria { Descricao = "Conta de Luz", Finalidade = Finalidade.Despesa }; // Só aceita despesa

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);
        var request = new TransacaoRequestDto
        {
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id,
            Valor = 150,
            Tipo = TipoTransacao.Receita, // Tentando usar categoria de despesa para uma receita
            Descricao = "Pagamento fake"
        };

        // Act & Assert
        var excecao = await Assert.ThrowsAsync<ArgumentException>(() => service.AdicionarTransacaoAsync(request));
        Assert.Equal("Esta categoria não permite receitas, apenas despesas.", excecao.Message);
    }

    [Fact]
    public async Task AdicionarTransacao_ValorZeradoOuNegativo_DeveLancarExcecao()
    {
        // Arrange
        var context = CriarContextoEmMemoria();
        var pessoa = new Pessoa { Nome = "Victor", Idade = 25 };
        var categoria = new Categoria { Descricao = "Salário", Finalidade = Finalidade.Receita };

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);
        var request = new TransacaoRequestDto
        {
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id,
            Valor = -50, // Valor inválido
            Tipo = TipoTransacao.Receita,
            Descricao = "Salário"
        };

        // Act & Assert
        var excecao = await Assert.ThrowsAsync<ArgumentException>(() => service.AdicionarTransacaoAsync(request));
        Assert.Equal("O valor da transação deve ser estritamente positivo.", excecao.Message);
    }

    [Fact]
    public async Task AdicionarTransacao_DadosValidos_DeveSalvarComSucesso()
    {
        // Arrange
        var context = CriarContextoEmMemoria();
        var pessoa = new Pessoa { Nome = "Victor", Idade = 25 };
        var categoria = new Categoria { Descricao = "Salário", Finalidade = Finalidade.Receita };

        context.Pessoas.Add(pessoa);
        context.Categorias.Add(categoria);
        await context.SaveChangesAsync();

        var service = new TransacaoService(context);
        var request = new TransacaoRequestDto
        {
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id,
            Valor = 5000,
            Tipo = TipoTransacao.Receita,
            Descricao = "Pagamento mensal"
        };

        // Act
        var resultado = await service.AdicionarTransacaoAsync(request);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(5000, resultado.Valor);
        Assert.Equal(1, context.Transacoes.Count()); // Verifica se realmente salvou no banco
    }
}