# Sistema de Locadora de Veículos — Etapa 1

Projeto desenvolvido para a etapa de **Modelagem do Banco de Dados**.

## Tecnologias

- C# / .NET 8
- Entity Framework Core 8
- SQL Server / SQL Express

## Entidades

O modelo possui cinco entidades:

1. Fabricante
2. Veículo
3. Cliente
4. Aluguel
5. Pagamento

A entidade **Pagamento** foi adicionada para atender ao requisito mínimo de cinco entidades e representar uma necessidade real do domínio.

## Relacionamentos

- Fabricante 1:N Veículo
- Cliente 1:N Aluguel
- Veículo 1:N Aluguel
- Aluguel 1:N Pagamento

## Integridade

Foram definidas:

- Chaves primárias em todas as entidades;
- Chaves estrangeiras para os relacionamentos;
- CPF único;
- E-mail único;
- Placa única;
- Campos obrigatórios;
- Precisão decimal para quilometragem e valores;
- Regras de exclusão nas relações.

## Entity Framework

O arquivo `Data/LocadoraContext.cs` contém o mapeamento das entidades para o modelo relacional por meio do Entity Framework Core.

O arquivo `Database/modelo_relacional.sql` apresenta o esquema relacional equivalente para SQL Server/SQL Express.

O arquivo `Database/modelo_conceitual.mmd` contém o modelo conceitual em formato Mermaid.

## Execução futura

Para utilizar o projeto em uma aplicação ASP.NET Core, o contexto deverá ser registrado no `Program.cs` com uma connection string apontando para o SQL Server Express.

Exemplo:

```csharp
builder.Services.AddDbContext<LocadoraContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

A implementação de endpoints, CRUD, filtros, Swagger e testes pertence às etapas posteriores e não foi incluída neste pacote.
