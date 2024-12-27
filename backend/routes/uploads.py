from flask import Blueprint, jsonify
import sqlite3

upload_routes = Blueprint('uploads', __name__)

@upload_routes.route('/list/<int:user_id>', methods=['GET'])
def list_user_uploads(user_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT filename, upload_time FROM uploads WHERE user_id = ?", (user_id,))
    uploads = cursor.fetchall()
    conn.close()

    upload_list = [{"filename": row[0], "upload_time": row[1]} for row in uploads]

    return jsonify({"uploads": upload_list})
