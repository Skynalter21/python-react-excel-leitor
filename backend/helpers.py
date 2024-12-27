import sqlite3

def is_admin(user_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT is_admin FROM users WHERE id = ?", (user_id,))
    result = cursor.fetchone()
    conn.close()
    return result and result[0] == 1
