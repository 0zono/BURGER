import time
import psycopg2
from flask import Flask, render_template
from models import db

from blueprints.produtos import produtos_bp
from blueprints.combos import combos_bp
from blueprints.clientes import clientes_bp
from blueprints.ingredientes import ingredientes_bp
from blueprints.itens_pedido import itens_pedido_bp
from blueprints.pedidos import pedidos_bp

# Aguarda o banco ficar pronto
while True:
    try:
        conn = psycopg2.connect(
            host="db",          # nome do serviço no docker-compose
            database="fastfood",
            user="postgres",
            password="postgres"
        )
        conn.close()
        break
    except:
        print("Banco não pronto, esperando 2s...")
        time.sleep(2)

# Inicia Flask
app = Flask(__name__, template_folder="frontend/templates", static_folder="frontend/static")
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://postgres:postgres@db:5432/fastfood"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Cria tabelas se não existirem
with app.app_context():
    db.create_all()

# Registra blueprint
app.register_blueprint(produtos_bp)
app.register_blueprint(combos_bp)
app.register_blueprint(clientes_bp)
app.register_blueprint(ingredientes_bp)
app.register_blueprint(itens_pedido_bp)
app.register_blueprint(pedidos_bp)
@app.route("/")
def index():
    return "API ON"
