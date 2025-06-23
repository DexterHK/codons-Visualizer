from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
from api.legacy_routes import legacy_bp

def create_app():
    """Application factory pattern for Flask app creation."""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:8080", "http://127.0.0.1:8080", "http://0.0.0.0:8080"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    app.config['CORS_HEADERS'] = 'Content-Type'
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(legacy_bp)  # Legacy routes without prefix
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
