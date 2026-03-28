using Microsoft.EntityFrameworkCore;
using Gastos.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Define o caminho do banco. Se estiver na Azure (tem a variável HOME), salva na pasta liberada.
var dbPath = "gastos.db";
var azureHome = Environment.GetEnvironmentVariable("HOME");
if (!string.IsNullOrEmpty(azureHome))
{
    dbPath = Path.Combine(azureHome, "gastos.db");
}

builder.Services.AddDbContext<GastosDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddScoped<Gastos.Application.Services.TransacaoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura o CORS para o React conseguir conversar com a API 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<GastosDbContext>();
    dbContext.Database.Migrate();
}

app.Run();