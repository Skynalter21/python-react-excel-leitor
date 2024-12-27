from werkzeug.security import check_password_hash
import sqlite3
from flask import Blueprint, request, jsonify
from flask_cors import CORS

# Criando o Blueprint para as rotas de autenticação
auth_routes = Blueprint('auth_routes', __name__, url_prefix='/auth')

# Ativando CORS apenas para o blueprint
CORS(auth_routes, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Função que verifica as credenciais
def check_user_credentials(email, password):
    # Conectar ao banco de dados SQLite
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Buscar o usuário pelo email
    cursor.execute("SELECT id, password FROM user WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    # Verificar se o usuário existe e se a senha está correta
    if user and check_password_hash(user[1], password):  # user[1] é a senha no banco
        return user[0]  # Retorna o id do usuário
    return None

# Rota para login
@auth_routes.route('/login', methods=['POST'])
def login():
    # Obter os dados do corpo da requisição
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Usuário e senha são obrigatórios"}), 400

    # Verificar as credenciais do usuário
    user_id = check_user_credentials(email, password)
    if user_id:
        return jsonify({"message": "Login bem-sucedido!", "user_id": user_id}), 200
    else:
        return jsonify({"error": "Credenciais inválidas"}), 401
