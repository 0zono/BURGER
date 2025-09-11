-- Cliente
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Ingredientes (estoque controlado aqui)
CREATE TABLE ingrediente (
    id_ingrediente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL  -- quantidade em estoque
);


-- Produto (ex: X-Burger, Refrigerante, Batata Frita)
CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL
);

-- Relacionamento Produto <-> Ingrediente
-- Define quantos ingredientes são necessários para montar um produto
CREATE TABLE produto_ingrediente (
    id_produto INT REFERENCES produto(id_produto) ON DELETE CASCADE,
    id_ingrediente INT REFERENCES ingrediente(id_ingrediente) ON DELETE CASCADE,
    quantidade_necessaria INT NOT NULL,
    PRIMARY KEY (id_produto, id_ingrediente)
);

-- Combo (ex: "Combo 1: X-Burger + Batata + Refri")
CREATE TABLE combo (
    id_combo SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL
);

-- Relacionamento Combo <-> Produto
CREATE TABLE combo_produto (
    id_combo INT REFERENCES combo(id_combo) ON DELETE CASCADE,
    id_produto INT REFERENCES produto(id_produto),
    quantidade INT NOT NULL,
    PRIMARY KEY (id_combo, id_produto)
);

-- Pedido
CREATE TABLE pedido (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES cliente(id_cliente),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pendente'
);

-- Itens do Pedido
CREATE TABLE item_pedido (
    id_item SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_produto INT REFERENCES produto(id_produto),
    id_combo INT REFERENCES combo(id_combo),
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL
);

--ingredientes
INSERT INTO ingrediente (nome, quantidade) VALUES
('Pão', 50),
('Carne', 30),
('Queijo', 20),
('Batata', 100),
('Refrigerante', 80);

-- Produtos
INSERT INTO produto (nome, descricao, preco) VALUES
('Hambúrguer', 'Clássico hambúrguer', 15.00),
('Batata Frita', 'Porção média', 8.00),
('Refrigerante', 'Lata 350ml', 6.00);

-- Produto Ingrediente
-- Hambúrguer
INSERT INTO produto_ingrediente (id_produto, id_ingrediente, quantidade_necessaria)
SELECT p.id_produto, i.id_ingrediente, 1
FROM produto p, ingrediente i
WHERE p.nome='Hambúrguer' AND i.nome='Pão';

INSERT INTO produto_ingrediente (id_produto, id_ingrediente, quantidade_necessaria)
SELECT p.id_produto, i.id_ingrediente, 1
FROM produto p, ingrediente i
WHERE p.nome='Hambúrguer' AND i.nome='Carne';

INSERT INTO produto_ingrediente (id_produto, id_ingrediente, quantidade_necessaria)
SELECT p.id_produto, i.id_ingrediente, 1
FROM produto p, ingrediente i
WHERE p.nome='Hambúrguer' AND i.nome='Queijo';

-- Batata Frita
INSERT INTO produto_ingrediente (id_produto, id_ingrediente, quantidade_necessaria)
SELECT p.id_produto, i.id_ingrediente, 1
FROM produto p, ingrediente i
WHERE p.nome='Batata Frita' AND i.nome='Batata';

-- Refrigerante
INSERT INTO produto_ingrediente (id_produto, id_ingrediente, quantidade_necessaria)
SELECT p.id_produto, i.id_ingrediente, 1
FROM produto p, ingrediente i
WHERE p.nome='Refrigerante' AND i.nome='Refrigerante';


-- Combo
INSERT INTO combo (nome, preco) VALUES
('Combo Clássico', 25.00);

-- Relacionamento Combo <-> Produto
INSERT INTO combo_produto (id_combo, id_produto, quantidade)
SELECT c.id_combo, p.id_produto, 1
FROM combo c, produto p
WHERE c.nome='Combo Clássico' AND p.nome='Hambúrguer';

INSERT INTO combo_produto (id_combo, id_produto, quantidade)
SELECT c.id_combo, p.id_produto, 1
FROM combo c, produto p
WHERE c.nome='Combo Clássico' AND p.nome='Batata Frita';

INSERT INTO combo_produto (id_combo, id_produto, quantidade)
SELECT c.id_combo, p.id_produto, 1
FROM combo c, produto p
WHERE c.nome='Combo Clássico' AND p.nome='Refrigerante';

