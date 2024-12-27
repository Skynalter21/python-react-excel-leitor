from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.auth import auth_routes
from routes.uploads import upload_routes
import pandas as pd
import os
import matplotlib.pyplot as plt
import io
import base64
from helpers import is_admin
import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash
from pprint import pprint
from routes.users import users_bp
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models.user import User

app = Flask(__name__)
CORS(app, resources={r"/auth/*": {"origins": "http://localhost:3000"}},
     methods=["GET", "POST", "OPTIONS"], supports_credentials=True)

@app.route('/upload', methods=['POST'])
def upload():
    # Verifique se a pasta 'uploads' existe, se não, crie-a
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    # Verifique se o arquivo foi enviado
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo encontrado"}), 400

    file = request.files['file']

    # Se não houver arquivo, retorna um erro
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400

    # Salve o arquivo na pasta uploads
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)

    # Leia o arquivo Excel com pandas
    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        return jsonify({"error": f"Erro ao ler o arquivo Excel: {str(e)}"}), 400

    # Verifique se o arquivo tem ao menos uma linha de dados
    if df.empty:
        return jsonify({"error": "O arquivo Excel está vazio."}), 400

    # Substituir NaN por uma string vazia ou valor desejado
    df = df.fillna('')  # Substitui NaN por 'Indisponível'

    # Recuperar as colunas do arquivo Excel
    columns = df.columns.tolist()

    # Agora, vamos pegar todas as linhas de dados
    data = df.to_dict(orient='records')

    return jsonify({
        "message": "Arquivo enviado com sucesso!",
        "columns": columns,
        "data": data
    }), 200

@app.route('/plot', methods=['POST'])
def plot():
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400

    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)

    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        return jsonify({"error": f"Erro ao ler o arquivo Excel: {str(e)}"}), 400

    if df.empty:
        return jsonify({"error": "O arquivo Excel está vazio."}), 400

    # Gera um gráfico de exemplo (pode ser personalizado de acordo com seus dados)
    plt.figure()
    df.plot(kind='bar')
    plt.title('Gráfico de Exemplo')
    plt.xlabel('Eixo X')
    plt.ylabel('Eixo Y')

    # Salva o gráfico em um objeto de bytes
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)

    # Converte a imagem para base64
    img_base64 = base64.b64encode(img.getvalue()).decode('utf-8')

    return jsonify({"image": img_base64}), 200

def is_admin(user_id):
    # Conectar ao banco de dados SQLite
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Consultar se o usuário é administrador
    cursor.execute("SELECT is_admin FROM user WHERE id = ?", (user_id,))
    result = cursor.fetchone()
    conn.close()

    if result and result[0] == 1:  # is_admin é 1 se o usuário for administrador
        return True
    return False

@app.route('/admin', methods=['GET'])
def admin_dashboard():
    user_id = request.headers.get('User-ID')  # Pega o ID do usuário do header (o que vem do front-end)

    # Verifica se o user_id foi enviado
    if not user_id:
        return jsonify({"error": "User-ID não fornecido"}), 400

    # Verificar se o usuário é administrador
    if not is_admin(user_id):
        return jsonify({"error": "Permissão negada"}), 403

    # Consultar a lista de usuários
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, is_admin FROM user")
    users = cursor.fetchall()
    conn.close()

    # Retornar a lista de usuários com dados formatados
    return jsonify({
        "users": [{"id": u[0], "email": u[1], "is_admin": bool(u[2])} for u in users]
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        # Buscar todos os usuários no banco de dados
        users = User.query.all()

        # Debug: Verificar se há usuários no banco
        print(f"Usuários encontrados: {len(users)}")

        # Se não houver usuários, retorna uma lista vazia
        if not users:
            return jsonify([]), 200

        # Retorna os dados dos usuários em formato JSON
        return jsonify([{
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin
        } for user in users]), 200
    except Exception as e:
        # Se houver algum erro, mostre o erro nos logs
        print(f"Erro ao buscar usuários: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
