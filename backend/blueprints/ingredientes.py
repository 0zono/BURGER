from flask import Blueprint, jsonify, request

ingredientes_bp = Blueprint("ingredientes", __name__)

@ingredientes_bp.route("", methods=["GET"])
def listar_ingredientes():
    return jsonify({"msg": "Listar ingredientes"})

@ingredientes_bp.route("/<int:id_ingrediente>", methods=["GET"])
def obter_ingrediente(id_ingrediente):
    return jsonify({"msg": f"Obter ingrediente {id_ingrediente}"})

@ingredientes_bp.route("/<int:id_ingrediente>", methods=["PUT"])
def atualizar_ingrediente(id_ingrediente):
    return jsonify({"msg": f"Atualizar ingrediente {id_ingrediente}"})
