from flask import Blueprint, jsonify, request

produtos_bp = Blueprint("produtos", __name__)

@produtos_bp.route("", methods=["POST"])
def criar_produto():
    return jsonify({"msg": "Criar produto"}), 201

@produtos_bp.route("", methods=["GET"])
def listar_produtos():
    return jsonify({"msg": "Listar produtos"})

@produtos_bp.route("/<int:id_produto>", methods=["GET"])
def obter_produto(id_produto):
    return jsonify({"msg": f"Obter produto {id_produto}"})

@produtos_bp.route("/<int:id_produto>", methods=["PUT"])
def atualizar_produto(id_produto):
    return jsonify({"msg": f"Atualizar produto {id_produto}"})

@produtos_bp.route("/<int:id_produto>", methods=["DELETE"])
def excluir_produto(id_produto):
    return jsonify({"msg": f"Excluir produto {id_produto}"})
