using System.Text.Json.Serialization;
using LocadoraVeiculos.Data;
using LocadoraVeiculos.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Evita erro de referência circular (Veiculo -> Fabricante -> Veiculos ...) na serialização JSON.
builder.Services.AddControllers().AddJsonOptions(o =>
    o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddDbContext<LocadoraContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();

// CORS: permite abrir o front-end por outro servidor (ex.: Live Server) durante o desenvolvimento.
builder.Services.AddCors(o => o.AddPolicy("Frontend", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("Frontend");

// Serve a pasta Frontend/ na raiz do site: https://localhost:<porta>/
var frontendPath = Path.Combine(builder.Environment.ContentRootPath, "Frontend");
if (Directory.Exists(frontendPath))
{
    var provider = new PhysicalFileProvider(frontendPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = provider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = provider });
}

app.MapControllers();
app.Run();
