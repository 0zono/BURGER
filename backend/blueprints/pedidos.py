from flask import Blueprint, jsonify, request
from models import db, Pedido, Cliente, ItemPedido

pedidos_bp = Blueprint("pedidos", __name__, url_prefix="/pedidos")

# Criar pedido
@pedidos_bp.route("", methods=["POST"])
def criar_pedido():
    data = request.get_json()
    novo_pedido = Pedido(
        id_cliente=data["id_cliente"],
        status=data.get("status", "pendente")
    )
    db.session.add(novo_pedido)
    db.session.commit()
    return jsonify({"msg": "Pedido criado", "id_pedido": novo_pedido.id_pedido}), 201

# Listar pedidos
@pedidos_bp.route("", methods=["GET"])
def listar_pedidos():
    pedidos = Pedido.query.all()
    resultado = []
    for p in pedidos:
        resultado.append({
            "id_pedido": p.id_pedido,
            "id_cliente": p.id_cliente,
            "data_hora": p.data_hora.isoformat(),
            "status": p.status
        })
    return jsonify(resultado)

# Obter pedido específico
@pedidos_bp.route("/<int:id_pedido>", methods=["GET"])
def obter_pedido(id_pedido):
    pedido = Pedido.query.get_or_404(id_pedido)
    return jsonify({
        "id_pedido": pedido.id_pedido,
        "id_cliente": pedido.id_cliente,
        "data_hora": pedido.data_hora.isoformat(),
        "status": pedido.status
    })

# Atualizar status do pedido
@pedidos_bp.route("/<int:id_pedido>/status", methods=["PUT"])
def atualizar_status_pedido(id_pedido):
    pedido = Pedido.query.get_or_404(id_pedido)
    data = request.get_json()
    pedido.status = data.get("status", pedido.status)
    db.session.commit()
    return jsonify({"msg": f"Status do pedido {id_pedido} atualizado", "novo_status": pedido.status})
