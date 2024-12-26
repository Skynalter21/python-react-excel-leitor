from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)
