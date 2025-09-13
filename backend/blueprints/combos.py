from flask import Blueprint, jsonify, request

combos_bp = Blueprint("combos", __name__)

@combos_bp.route("", methods=["POST"])
def criar_combo():
    return jsonify({"msg": "Criar combo"}), 201

@combos_bp.route("", methods=["GET"])
def listar_combos():
    return jsonify({"msg": "Listar combos"})

@combos_bp.route("/<int:id_combo>", methods=["GET"])
def obter_combo(id_combo):
    return jsonify({"msg": f"Obter combo {id_combo}"})

@combos_bp.route("/<int:id_combo>", methods=["PUT"])
def atualizar_combo(id_combo):
    return jsonify({"msg": f"Atualizar combo {id_combo}"})

@combos_bp.route("/<int:id_combo>", methods=["DELETE"])
def excluir_combo(id_combo):
    return jsonify({"msg": f"Excluir combo {id_combo}"})
