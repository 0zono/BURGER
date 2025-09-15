from flask import Blueprint, request, jsonify
from models import db, Cliente, Pedido, ItemPedido, Produto, Combo
from datetime import datetime

pedidos_bp = Blueprint("pedidos", __name__, url_prefix="/pedidos")

@pedidos_bp.route("/", methods=["POST"])
def criar_pedido():
    data = request.get_json()

    # 1️⃣ Obter ou criar cliente
    id_cliente = data.get("id_cliente")
    if not id_cliente:
        nome_cliente = data.get("cliente", {}).get("nome")
        if not nome_cliente:
            return jsonify({"msg": "Nome do cliente obrigatório"}), 400
        novo_cliente = Cliente(nome=nome_cliente)
        db.session.add(novo_cliente)
        db.session.commit()
        id_cliente = novo_cliente.id_cliente

    # 2️⃣ Criar pedido
    novo_pedido = Pedido(
        id_cliente=id_cliente,
        data_hora=datetime.now(),
        status="pendente"
    )
    db.session.add(novo_pedido)
    db.session.commit()

    # 3️⃣ Adicionar itens ao pedido
    for i in data.get("itens", []):
        # Determinar o preço do item
        preco_unitario = 0
        if i.get("id_produto"):
            produto = Produto.query.get(i["id_produto"])
            if produto:
                preco_unitario = float(produto.preco)
        elif i.get("id_combo"):
            combo = Combo.query.get(i["id_combo"])
            if combo:
                preco_unitario = float(combo.preco)

        item = ItemPedido(
            id_pedido=novo_pedido.id_pedido,
            id_produto=i.get("id_produto"),
            id_combo=i.get("id_combo"),
            quantidade=i.get("quantidade", 1),
            preco_unitario=preco_unitario
        )
        db.session.add(item)

    db.session.commit()
    return jsonify({
        "msg": "Pedido criado",
        "id_pedido": novo_pedido.id_pedido,
        "id_cliente": id_cliente
    })


# Listar pedidos
@pedidos_bp.route("/", methods=["GET"])
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
