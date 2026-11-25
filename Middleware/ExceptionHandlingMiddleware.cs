using System.Text.Json;
namespace LocadoraVeiculos.Middleware;
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    public ExceptionHandlingMiddleware(RequestDelegate next) => _next = next;
    public async Task InvokeAsync(HttpContext context)
    {
        try { await _next(context); }
        catch (Exception)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { mensagem = "Ocorreu um erro interno ao processar a requisição." }));
        }
    }
}
