from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# --- Tabelas Principais ---

class Produto(db.Model):
    __tablename__ = "produto"
    id_produto = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    preco = db.Column(db.Numeric(10, 2), nullable=False)
    # Relacionamento para acessar os ingredientes de um produto
    ingredientes = db.relationship('ProdutoIngrediente', backref='produto')


class Ingrediente(db.Model):
    __tablename__ = "ingrediente"
    id_ingrediente = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)


class Cliente(db.Model):
    __tablename__ = "cliente"
    id_cliente = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)


class Combo(db.Model):
    __tablename__ = "combo"
    id_combo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Numeric(10, 2), nullable=False)
    # Relacionamento para acessar os produtos de um combo
    produtos = db.relationship('ComboProduto', backref='combo')


class Pedido(db.Model):
    __tablename__ = "pedido"
    id_pedido = db.Column(db.Integer, primary_key=True)
    id_cliente = db.Column(db.Integer, db.ForeignKey("cliente.id_cliente"))
    data_hora = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(db.String(20), default="pendente")
    
    cliente = db.relationship('Cliente', backref='pedidos')
    itens = db.relationship('ItemPedido', backref='pedido', cascade="all, delete-orphan")


# --- Tabelas de Associação (Muitos-para-Muitos) ---

class ProdutoIngrediente(db.Model):
    __tablename__ = "produto_ingrediente"
    id_produto = db.Column(db.Integer, db.ForeignKey("produto.id_produto"), primary_key=True)
    id_ingrediente = db.Column(db.Integer, db.ForeignKey("ingrediente.id_ingrediente"), primary_key=True)
    quantidade_necessaria = db.Column(db.Integer, nullable=False)
    # Relacionamento para acessar o ingrediente a partir desta tabela
    ingrediente = db.relationship('Ingrediente')


class ComboProduto(db.Model):
    __tablename__ = "combo_produto"
    id_combo = db.Column(db.Integer, db.ForeignKey("combo.id_combo"), primary_key=True)
    id_produto = db.Column(db.Integer, db.ForeignKey("produto.id_produto"), primary_key=True)
    quantidade = db.Column(db.Integer, nullable=False)
    # Relacionamento para acessar o produto a partir desta tabela
    produto = db.relationship('Produto')


class ItemPedido(db.Model):
    __tablename__ = 'item_pedido'
    id_item = db.Column(db.Integer, primary_key=True)
    id_pedido = db.Column(db.Integer, db.ForeignKey('pedido.id_pedido'), nullable=False)
    
    # <<< CORREÇÃO AQUI
    # A ForeignKey deve apontar para o nome exato da coluna na tabela 'produto'
    id_produto = db.Column(db.Integer, db.ForeignKey('produto.id_produto'), nullable=True)
    
    id_combo = db.Column(db.Integer, db.ForeignKey('combo.id_combo'), nullable=True)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario = db.Column(db.Numeric(10, 2), nullable=False)

    produto = db.relationship('Produto')
    combo = db.relationship('Combo')

    def __repr__(self):
        return f'<ItemPedido {self.id_item}>'