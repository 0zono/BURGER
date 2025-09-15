from flask import Blueprint, jsonify, request
from models import db, ItemPedido, Produto, Combo

itens_pedido_bp = Blueprint("itens_pedido", __name__, url_prefix="/itens_pedido")

# Listar itens de um pedido
@itens_pedido_bp.route("/<int:id_pedido>", methods=["GET"])
def listar_itens_pedido(id_pedido):
    itens = ItemPedido.query.filter_by(id_pedido=id_pedido).all()
    resultado = []
    for item in itens:
        resultado.append({
            "id_item": item.id_item,
            "id_produto": item.id_produto,
            "id_combo": item.id_combo,
            "quantidade": item.quantidade,
            "preco_unitario": float(item.preco_unitario)
        })
    return jsonify(resultado)

# Adicionar item ao pedido
@itens_pedido_bp.route("/<int:id_pedido>", methods=["POST"])
def adicionar_item_pedido(id_pedido):
    data = request.get_json()
    novo_item = ItemPedido(
        id_pedido=id_pedido,
        id_produto=data.get("id_produto"),
        id_combo=data.get("id_combo"),
        quantidade=data["quantidade"],
        preco_unitario=data["preco_unitario"]
    )
    db.session.add(novo_item)
    db.session.commit()
    return jsonify({"msg": "Item adicionado", "id_item": novo_item.id_item}), 201

# Remover item do pedido
@itens_pedido_bp.route("/<int:id_pedido>/<int:id_item>", methods=["DELETE"])
def remover_item_pedido(id_pedido, id_item):
    item = ItemPedido.query.filter_by(id_pedido=id_pedido, id_item=id_item).first_or_404()
    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": f"Item {id_item} do pedido {id_pedido} removido"})
