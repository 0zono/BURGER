from flask import Blueprint, request, jsonify
from models import db, Produto, ProdutoIngrediente, Ingrediente

produtos_bp = Blueprint("produtos", __name__, url_prefix="/produtos")

# Criar produto
@produtos_bp.route("/", methods=["POST"])
def criar_produto():
    data = request.json
    nome = data.get("nome")
    descricao = data.get("descricao", "")
    preco = data.get("preco")
    if not nome or preco is None:
        return jsonify({"error": "Nome e preço são obrigatórios"}), 400

    produto = Produto(nome=nome, descricao=descricao, preco=preco)
    db.session.add(produto)
    db.session.commit()
    return jsonify({"msg": "Produto criado", "id": produto.id_produto}), 201

# Listar produtos
@produtos_bp.route("/", methods=["GET"])
def listar_produtos():
    produtos = Produto.query.all()
    resultado = []
    for p in produtos:
        resultado.append({
            "id": p.id_produto,
            "nome": p.nome,
            "descricao": p.descricao,
            "preco": float(p.preco)
        })
    return jsonify(resultado)

# Obter produto
@produtos_bp.route("/<int:id_produto>", methods=["GET"])
def obter_produto(id_produto):
    produto = Produto.query.get(id_produto)
    if not produto:
        return jsonify({"error": "Produto não encontrado"}), 404
    return jsonify({
        "id": produto.id_produto,
        "nome": produto.nome,
        "descricao": produto.descricao,
        "preco": float(produto.preco)
    })

# Atualizar produto
@produtos_bp.route("/<int:id_produto>", methods=["PUT"])
def atualizar_produto(id_produto):
    produto = Produto.query.get(id_produto)
    if not produto:
        return jsonify({"error": "Produto não encontrado"}), 404

    data = request.json
    produto.nome = data.get("nome", produto.nome)
    produto.descricao = data.get("descricao", produto.descricao)
    produto.preco = data.get("preco", produto.preco)

    db.session.commit()
    return jsonify({"msg": "Produto atualizado"})

# Excluir produto
@produtos_bp.route("/<int:id_produto>", methods=["DELETE"])
def excluir_produto(id_produto):
    produto = Produto.query.get(id_produto)
    if not produto:
        return jsonify({"error": "Produto não encontrado"}), 404

    db.session.delete(produto)
    db.session.commit()
    return jsonify({"msg": "Produto excluído"})
