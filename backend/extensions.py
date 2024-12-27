from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Inicialização das extensões
db = SQLAlchemy()
migrate = Migrate()
