# Roteiro do vídeo (pitch de 3 a 5 minutos)

Grave a tela com áudio (OBS, Xbox Game Bar ou o gravador do Windows). Use o sistema rodando com o **banco real** e `dados_exemplo.sql` carregado. Não exiba conteúdo de terceiros.

| Tempo | O que mostrar | O que falar |
|---|---|---|
| 0:00–0:30 | Painel | Apresente-se. **Problema**: locadoras pequenas controlam frota, aluguéis e pagamentos em planilhas e não conseguem saber rápido quais carros estão na rua nem quanto cada cliente pagou. |
| 0:30–1:15 | Diagrama ER (`Docs/modelo_conceitual.png`) | **Modelagem**: 5 entidades (Fabricante, Veículo, Cliente, Aluguel, Pagamento), relacionamentos 1:N, CPF/e-mail/placa únicos, exclusão restrita. Banco SQL Server com EF Core; API REST em ASP.NET; front em HTML/CSS/JS. |
| 1:15–2:15 | Tela de Veículos | **CRUD + filtros**: filtre por modelo e fabricante (mostre a rota `GET /api/Veiculos?...` acima da tabela), cadastre um veículo, tente repetir a placa (erro da API no formulário), edite e exclua. |
| 2:15–3:15 | Consultas → *Veículos por fabricante* | **Exemplo 1 (banco + rota)**: abra "Ver SQL equivalente" (JOIN Veiculos × Fabricantes), execute e mostre a rota `/api/Filtros/veiculos-por-fabricante/{id}` e o resultado. |
| 3:15–4:15 | Consultas → *Aluguéis por fabricante* | **Exemplo 2**: SQL com 3 JOINs, rota `/api/Filtros/alugueis-por-fabricante/{id}`, tabela e total locado. Se der tempo, mostre *Veículos alugados agora*. |
| 4:15–4:45 | Aluguel (formulário) | Destaque: valor total calculado, km inicial do veículo, regra de veículo já alugado. |
| 4:45–5:00 | Painel | Fechamento: o que o sistema resolve e próximos passos (autenticação, paginação). |

Dica: ensaie uma vez; o limite é 5 minutos. Se passar, corte o item do formulário de aluguel.
