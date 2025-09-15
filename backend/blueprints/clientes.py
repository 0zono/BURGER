from flask import Blueprint, jsonify, request
from models import db, Cliente

clientes_bp = Blueprint("clientes", __name__, url_prefix="/clientes")

# Criar cliente
@clientes_bp.route("/", methods=["POST"])
def criar_cliente():
    data = request.get_json()
    novo_cliente = Cliente(
        nome=data.get("nome")
    )
    db.session.add(novo_cliente)
    db.session.commit()
    return jsonify({"msg": "Cliente criado", "id": novo_cliente.id_cliente}), 201

# Obter cliente por ID
@clientes_bp.route("/<int:id_cliente>", methods=["GET"])
def obter_cliente(id_cliente):
    cliente = Cliente.query.get_or_404(id_cliente)
    return jsonify({
        "id_cliente": cliente.id_cliente,
        "nome": cliente.nome
    })

# Listar todos os clientes
@clientes_bp.route("/", methods=["GET"])
def listar_clientes():
    clientes = Cliente.query.all()
    return jsonify([
        {
            "id_cliente": c.id_cliente,
            "nome": c.nome
        } for c in clientes
    ])

# Atualizar cliente
@clientes_bp.route("/<int:id_cliente>", methods=["PUT"])
def atualizar_cliente(id_cliente):
    cliente = Cliente.query.get_or_404(id_cliente)
    data = request.get_json()
    cliente.nome = data.get("nome", cliente.nome)
    db.session.commit()
    return jsonify({"msg": "Cliente atualizado"})

# Deletar cliente
@clientes_bp.route("/<int:id_cliente>", methods=["DELETE"])
def deletar_cliente(id_cliente):
    cliente = Cliente.query.get_or_404(id_cliente)
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({"msg": "Cliente deletado"})
