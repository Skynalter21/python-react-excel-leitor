# backend/routes/users.py
from flask import Blueprint, jsonify
from models.user import User  # Importa o modelo User de models/user.py

users_bp = Blueprint('users', __name__)  # Cria o Blueprint

@users_bp.route('/api/users', methods=['GET'])  # Rota com o Blueprint
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
