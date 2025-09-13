from flask import Blueprint, jsonify, request

clientes_bp = Blueprint("clientes", __name__)

@clientes_bp.route("", methods=["POST"])
def criar_cliente():
    return jsonify({"msg": "Criar cliente"}), 201

@clientes_bp.route("/<int:id_cliente>", methods=["GET"])
def obter_cliente(id_cliente):
    return jsonify({"msg": f"Obter cliente {id_cliente}"})
