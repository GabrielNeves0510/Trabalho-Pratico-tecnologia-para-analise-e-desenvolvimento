# Front-end — Locadora de Veículos (Etapa 3)

Interface web em HTML, CSS e JavaScript puro (módulos ES), sem bibliotecas de terceiros.
Todos os dados vêm da API ASP.NET Core; não há dados estáticos ou mocados.

## Estrutura
```
Frontend/
├── index.html            # casca da aplicação (menu + área principal)
├── css/style.css         # estilos (responsivo)
└── js/
    ├── config.js         # URL base da API
    ├── api.js            # requisições fetch + tradução de erros da API
    ├── ui.js             # modais, avisos (toast), formatação, tabela
    ├── crud.js           # fábrica de telas: listagem + filtros + formulário + exclusão
    ├── lookups.js        # carrega opções dos selects a partir da API
    ├── app.js            # roteador por hash (#/veiculos, #/consultas...)
    └── pages/
        ├── entities.js   # configuração das 5 entidades (colunas, campos, filtros)
        ├── consultas.js  # as 5 rotas de /api/Filtros + SQL equivalente
        └── dashboard.js  # painel
```

## Executar
O ASP.NET serve esta pasta automaticamente. Na raiz do repositório: `dotnet run` e abra o endereço mostrado.

Para abrir o front por outro servidor (ex.: Live Server), edite `js/config.js` e use a URL da API em `API_BASE`.

## Rotas utilizadas
| Tela | Rotas |
|---|---|
| CRUD das 5 entidades | `GET/POST/PUT/DELETE /api/{Fabricantes,Veiculos,Clientes,Alugueis,Pagamentos}` (+ filtros por query string) |
| Consultas | `GET /api/Filtros/veiculos-por-fabricante/{id}`, `alugueis-por-cliente/{id}`, `veiculos-alugados`, `pagamentos-por-aluguel/{id}`, `alugueis-por-fabricante/{id}` |
| Painel | listagens + `veiculos-alugados` |
