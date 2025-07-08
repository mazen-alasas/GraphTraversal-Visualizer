from flask import Flask
import os

def create_app():
    app = Flask(__name__, template_folder='../templates')
    
    from .routes import graph_bp
    app.register_blueprint(graph_bp)
    
    return app