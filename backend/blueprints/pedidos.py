from flask import Blueprint, request, jsonify
from models import db, Cliente, Pedido, ItemPedido, Produto, Combo
from datetime import datetime
# NOVO IMPORT para otimização de performance
from sqlalchemy.orm import joinedload, selectinload
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
    # --- OTIMIZAÇÃO DE PERFORMANCE (Eager Loading) ---
    # Isso diz ao SQLAlchemy para já buscar os dados relacionados (cliente, itens, etc.)
    # em poucas queries, evitando o problema de N+1 requisições ao banco.
    query = Pedido.query.options(
        joinedload(Pedido.cliente), # Carrega o cliente junto com o pedido
        selectinload(Pedido.itens).joinedload(ItemPedido.produto), # Carrega os itens e seus produtos
        selectinload(Pedido.itens).joinedload(ItemPedido.combo)  # Carrega os itens e seus combos
    )

    # --- FILTRO POR STATUS (Opcional, mas recomendado) ---
    # Permite que o frontend peça, por exemplo, /pedidos/?status=pendente
    status_filtro = request.args.get('status')
    if status_filtro:
        query = query.filter(Pedido.status == status_filtro)
    
    # Ordena os pedidos do mais novo para o mais antigo
    pedidos = query.order_by(Pedido.data_hora.desc()).all()
    
    resultado = []
    for p in pedidos:
        # Monta a lista de itens para este pedido
        itens_list = []
        for item in p.itens: # "p.itens" funciona por causa do 'relationship' no seu model Pedido
            nome_item = ""
            if item.produto: # "item.produto" é o relacionamento de ItemPedido -> Produto
                nome_item = item.produto.nome
            elif item.combo: # "item.combo" é o relacionamento de ItemPedido -> Combo
                nome_item = item.combo.nome
            
            itens_list.append({
                "quantidade": item.quantidade,
                "nome": nome_item
            })

        # Monta o JSON final para este pedido
        resultado.append({
            "id_pedido": p.id_pedido,
            "data_hora": p.data_hora.isoformat(),
            "status": p.status,
            # "p.cliente" funciona por causa do 'relationship' no seu model Pedido
            "cliente": {
                "id_cliente": p.id_cliente,
                "nome": p.cliente.nome 
            },
            "itens": itens_list
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
