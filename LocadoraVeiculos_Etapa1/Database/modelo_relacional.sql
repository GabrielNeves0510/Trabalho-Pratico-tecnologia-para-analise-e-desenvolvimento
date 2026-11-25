-- Modelo relacional da Etapa 1
-- Compatível com SQL Server / SQL Express.

CREATE TABLE Fabricantes (
    Id INT IDENTITY(1,1) NOT NULL,
    Nome NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_Fabricantes PRIMARY KEY (Id)
);

CREATE TABLE Clientes (
    Id INT IDENTITY(1,1) NOT NULL,
    Nome NVARCHAR(150) NOT NULL,
    CPF NVARCHAR(11) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    Telefone NVARCHAR(20) NULL,
    CONSTRAINT PK_Clientes PRIMARY KEY (Id),
    CONSTRAINT UQ_Clientes_CPF UNIQUE (CPF),
    CONSTRAINT UQ_Clientes_Email UNIQUE (Email)
);

CREATE TABLE Veiculos (
    Id INT IDENTITY(1,1) NOT NULL,
    FabricanteId INT NOT NULL,
    Modelo NVARCHAR(100) NOT NULL,
    AnoFabricacao INT NOT NULL,
    Quilometragem DECIMAL(10,2) NOT NULL,
    Placa NVARCHAR(10) NOT NULL,
    CONSTRAINT PK_Veiculos PRIMARY KEY (Id),
    CONSTRAINT UQ_Veiculos_Placa UNIQUE (Placa),
    CONSTRAINT FK_Veiculos_Fabricantes
        FOREIGN KEY (FabricanteId) REFERENCES Fabricantes(Id)
);

CREATE TABLE Alugueis (
    Id INT IDENTITY(1,1) NOT NULL,
    ClienteId INT NOT NULL,
    VeiculoId INT NOT NULL,
    DataInicio DATETIME2 NOT NULL,
    DataPrevistaDevolucao DATETIME2 NOT NULL,
    DataDevolucao DATETIME2 NULL,
    QuilometragemInicial DECIMAL(10,2) NOT NULL,
    QuilometragemFinal DECIMAL(10,2) NULL,
    ValorDiaria DECIMAL(10,2) NOT NULL,
    ValorTotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT PK_Alugueis PRIMARY KEY (Id),
    CONSTRAINT FK_Alugueis_Clientes
        FOREIGN KEY (ClienteId) REFERENCES Clientes(Id),
    CONSTRAINT FK_Alugueis_Veiculos
        FOREIGN KEY (VeiculoId) REFERENCES Veiculos(Id)
);

CREATE TABLE Pagamentos (
    Id INT IDENTITY(1,1) NOT NULL,
    AluguelId INT NOT NULL,
    DataPagamento DATETIME2 NOT NULL,
    Valor DECIMAL(10,2) NOT NULL,
    FormaPagamento NVARCHAR(30) NOT NULL,
    CONSTRAINT PK_Pagamentos PRIMARY KEY (Id),
    CONSTRAINT FK_Pagamentos_Alugueis
        FOREIGN KEY (AluguelId) REFERENCES Alugueis(Id)
);
