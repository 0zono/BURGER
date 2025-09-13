from flask import Blueprint, jsonify, request

itens_pedido_bp = Blueprint("itens_pedido", __name__)

@itens_pedido_bp.route("/<int:id_pedido>", methods=["GET"])
def listar_itens_pedido(id_pedido):
    return jsonify({"msg": f"Listar itens do pedido {id_pedido}"})

@itens_pedido_bp.route("/<int:id_pedido>", methods=["POST"])
def adicionar_item_pedido(id_pedido):
    return jsonify({"msg": f"Adicionar item ao pedido {id_pedido}"}), 201

@itens_pedido_bp.route("/<int:id_pedido>/<int:id_item>", methods=["DELETE"])
def remover_item_pedido(id_pedido, id_item):
    return jsonify({"msg": f"Remover item {id_item} do pedido {id_pedido}"})
