# Locadora de Veículos — Etapas 1 a 3

Backend ASP.NET Core baseado na modelagem da Etapa 1.

## Requisitos atendidos
- API REST em C# / ASP.NET Core.
- Entity Framework Core com SQL Server Express.
- CRUD completo para Fabricante, Veículo, Cliente, Aluguel e Pagamento.
- Validação por Data Annotations e regras de negócio.
- Tratamento global de exceções.
- Cinco rotas de filtros com relacionamentos entre tabelas:
  1. `GET /api/Filtros/veiculos-por-fabricante/{fabricanteId}`
  2. `GET /api/Filtros/alugueis-por-cliente/{clienteId}`
  3. `GET /api/Filtros/veiculos-alugados`
  4. `GET /api/Filtros/pagamentos-por-aluguel/{aluguelId}`
  5. `GET /api/Filtros/alugueis-por-fabricante/{fabricanteId}`

Os filtros usam navegações do Entity Framework que são traduzidas para JOINs SQL entre entidades relacionadas.

## Executar
1. Abra no Visual Studio.
2. Confirme o SQL Server Express.
3. Ajuste `appsettings.json` se a instância SQL for diferente de `.\\SQLEXPRESS`.
4. Execute `dotnet restore`, `dotnet build` e `dotnet run`.
5. Para criar o banco via EF: `dotnet ef migrations add InitialCreate` e `dotnet ef database update`.

Swagger, testes manuais e documentação de endpoints são da Etapa 3 e não foram incluídos nesta entrega.


---

## Etapa 3 — Front-end

- Pasta `Frontend/` (HTML + CSS + JavaScript) servida pela própria API em `/`. Veja `Frontend/README.md`.
- Pasta `Docs/`: relatório (`.docx` e `.pdf`), wireframes (`wireframes/`, SVG e PNG), prints das telas (`telas/`) e diagrama ER.
- Ajustes no back-end: filtros por query string nos `GET` de listagem (`/api/Veiculos?modelo=&fabricanteId=...`), CORS, arquivos estáticos e `ReferenceHandler.IgnoreCycles` na serialização JSON.
- `LocadoraVeiculos_Etapa1/Database/dados_exemplo.sql`: dados de exemplo para demonstração.

Acesse `https://localhost:<porta>/` após `dotnet run`.
