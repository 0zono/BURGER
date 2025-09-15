from flask import Blueprint, jsonify, request
from models import db, Combo, ComboProduto, Produto

combos_bp = Blueprint("combos", __name__, url_prefix="/combos")

# Criar combo
@combos_bp.route("/", methods=["POST"])
def criar_combo():
    data = request.get_json()
    novo_combo = Combo(
        nome=data["nome"],
        preco=data["preco"]
    )
    db.session.add(novo_combo)
    db.session.commit()

    # Relacionar produtos ao combo, se enviados
    produtos = data.get("produtos", [])
    for p in produtos:
        produto = Produto.query.get(p["id_produto"])
        if produto:
            cp = ComboProduto(
                id_combo=novo_combo.id_combo,
                id_produto=produto.id_produto,
                quantidade=p.get("quantidade", 1)
            )
            db.session.add(cp)
    db.session.commit()

    return jsonify({"msg": "Combo criado", "id_combo": novo_combo.id_combo}), 201

# Listar todos os combos
@combos_bp.route("/", methods=["GET"])
def listar_combos():
    combos = Combo.query.all()
    resultado = []
    for c in combos:
        produtos = ComboProduto.query.filter_by(id_combo=c.id_combo).all()
        resultado.append({
            "id_combo": c.id_combo,
            "nome": c.nome,
            "preco": str(c.preco),
            "produtos": [{"id_produto": p.id_produto, "quantidade": p.quantidade} for p in produtos]
        })
    return jsonify(resultado)

# Obter combo por ID
@combos_bp.route("/<int:id_combo>", methods=["GET"])
def obter_combo(id_combo):
    combo = Combo.query.get_or_404(id_combo)
    produtos = ComboProduto.query.filter_by(id_combo=id_combo).all()
    return jsonify({
        "id_combo": combo.id_combo,
        "nome": combo.nome,
        "preco": str(combo.preco),
        "produtos": [{"id_produto": p.id_produto, "quantidade": p.quantidade} for p in produtos]
    })

# Atualizar combo
@combos_bp.route("/<int:id_combo>", methods=["PUT"])
def atualizar_combo(id_combo):
    combo = Combo.query.get_or_404(id_combo)
    data = request.get_json()
    combo.nome = data.get("nome", combo.nome)
    combo.preco = data.get("preco", combo.preco)
    db.session.commit()
    return jsonify({"msg": "Combo atualizado"})

# Deletar combo
@combos_bp.route("/<int:id_combo>", methods=["DELETE"])
def excluir_combo(id_combo):
    combo = Combo.query.get_or_404(id_combo)
    db.session.delete(combo)
    db.session.commit()
    return jsonify({"msg": "Combo deletado"})
