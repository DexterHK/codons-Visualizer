from flask import Flask, jsonify
from flask_cors import CORS
from api.routes import api_bp
from api.legacy_routes import legacy_bp

def create_app():
    """Application factory pattern for Flask app creation."""
    app = Flask(__name__)
    
    # Configure CORS - Allow requests from both ports
    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:8080", "http://127.0.0.1:8080", "http://0.0.0.0:8080",
                "http://localhost:5000", "http://127.0.0.1:5000", "http://0.0.0.0:5000",
                "http://139.59.213.46:8080", "http://139.59.213.46:5000"
            ],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    app.config['CORS_HEADERS'] = 'Content-Type'
    
    # Add a root route to prevent "Not Found" errors
    @app.route('/')
    def index():
        return jsonify({
            "message": "Codons Visualizer Backend API",
            "status": "running",
            "endpoints": {
                "api": "/api/*",
                "legacy": "/*"
            }
        })
    
    # Add a health check endpoint
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy"})
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(legacy_bp)  # Legacy routes without prefix
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
