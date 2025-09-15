from flask import Blueprint, jsonify, request
from models import db, Ingrediente

ingredientes_bp = Blueprint("ingredientes", __name__, url_prefix="/ingredientes")

# Listar todos os ingredientes
@ingredientes_bp.route("/", methods=["GET"])
def listar_ingredientes():
    ingredientes = Ingrediente.query.all()
    resultado = [
        {"id_ingrediente": i.id_ingrediente, "nome": i.nome, "quantidade": i.quantidade}
        for i in ingredientes
    ]
    return jsonify(resultado)

# Obter ingrediente por ID
@ingredientes_bp.route("/<int:id_ingrediente>", methods=["GET"])
def obter_ingrediente(id_ingrediente):
    ingrediente = Ingrediente.query.get_or_404(id_ingrediente)
    return jsonify({
        "id_ingrediente": ingrediente.id_ingrediente,
        "nome": ingrediente.nome,
        "quantidade": ingrediente.quantidade
    })

# Atualizar ingrediente
@ingredientes_bp.route("/<int:id_ingrediente>", methods=["PUT"])
def atualizar_ingrediente(id_ingrediente):
    ingrediente = Ingrediente.query.get_or_404(id_ingrediente)
    data = request.get_json()
    ingrediente.nome = data.get("nome", ingrediente.nome)
    ingrediente.quantidade = data.get("quantidade", ingrediente.quantidade)
    db.session.commit()
    return jsonify({"msg": f"Ingrediente {id_ingrediente} atualizado"})

# Criar ingrediente
@ingredientes_bp.route("/", methods=["POST"])
def criar_ingrediente():
    data = request.get_json()
    novo_ingrediente = Ingrediente(
        nome=data["nome"],
        quantidade=data.get("quantidade", 0)
    )
    db.session.add(novo_ingrediente)
    db.session.commit()
    return jsonify({"msg": "Ingrediente criado", "id_ingrediente": novo_ingrediente.id_ingrediente}), 201

# Deletar ingrediente
@ingredientes_bp.route("/<int:id_ingrediente>", methods=["DELETE"])
def excluir_ingrediente(id_ingrediente):
    ingrediente = Ingrediente.query.get_or_404(id_ingrediente)
    db.session.delete(ingrediente)
    db.session.commit()
    return jsonify({"msg": f"Ingrediente {id_ingrediente} deletado"})
