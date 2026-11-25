-- Dados de exemplo para demonstração do front-end (Etapa 3).
-- Execute DEPOIS de criar as tabelas (migrations do EF ou modelo_relacional.sql), em banco vazio.
-- Os IDs são gerados automaticamente (IDENTITY), na ordem abaixo.

INSERT INTO Fabricantes (Nome) VALUES (N'Fiat'), (N'Volkswagen'), (N'Toyota'), (N'Chevrolet');

INSERT INTO Veiculos (FabricanteId, Modelo, AnoFabricacao, Quilometragem, Placa) VALUES
 (1, N'Argo',    2022, 18500.00, N'QWE1A23'),
 (1, N'Mobi',    2021, 32100.00, N'RTY2B34'),
 (2, N'Polo',    2023,  9800.00, N'UIO3C45'),
 (3, N'Corolla', 2020, 54200.00, N'PAS4D56'),
 (2, N'T-Cross', 2024,  4300.00, N'FGH5E67');

INSERT INTO Clientes (Nome, CPF, Email, Telefone) VALUES
 (N'Maria Souza',  N'11122233344', N'maria@email.com', N'(31) 99111-2222'),
 (N'João Pereira', N'55566677788', N'joao@email.com',  N'(31) 98888-1111'),
 (N'Ana Costa',    N'99900011122', N'ana@email.com',   N'(31) 97777-3333');

INSERT INTO Alugueis (ClienteId, VeiculoId, DataInicio, DataPrevistaDevolucao, DataDevolucao, QuilometragemInicial, QuilometragemFinal, ValorDiaria, ValorTotal) VALUES
 (1, 1, '2026-10-02', '2026-10-09', '2026-10-09', 18000.00, 18500.00, 120.00,  840.00),
 (2, 3, '2026-11-15', '2026-11-28', NULL,          9500.00,     NULL, 150.00, 1950.00),
 (1, 4, '2026-11-20', '2026-11-27', NULL,         54000.00,     NULL, 180.00, 1260.00),
 (3, 2, '2026-09-10', '2026-09-15', '2026-09-15', 31500.00, 32100.00, 100.00,  500.00);

INSERT INTO Pagamentos (AluguelId, DataPagamento, Valor, FormaPagamento) VALUES
 (1, '2026-10-02',  840.00, N'PIX'),
 (2, '2026-11-15',  900.00, N'Cartão de crédito'),
 (4, '2026-09-10',  500.00, N'Dinheiro');
