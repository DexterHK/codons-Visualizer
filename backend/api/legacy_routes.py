from flask import Blueprint, request, jsonify
from services.codon_service import CodonService
from services.graph_service import GraphService
from services.properties_service import PropertiesService

legacy_bp = Blueprint('legacy', __name__)

# Initialize services
codon_service = CodonService()
graph_service = GraphService()
properties_service = PropertiesService()

# Legacy routes for frontend compatibility
@legacy_bp.route("/codons-list", methods=["POST", "OPTIONS"])
def get_codons_list():
    """Get the original codon graph (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_original_graph(num_of_codons, codons)
        return jsonify(graph), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/codons-list-alpha-one", methods=["POST", "OPTIONS"])
def get_codons_list_alpha_one():
    """Get the alpha-one codon graph (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_alpha_one_graph(num_of_codons, codons)
        return jsonify(graph), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/codons-list-alpha-two", methods=["POST", "OPTIONS"])
def get_codons_list_alpha_two():
    """Get the alpha-two codon graph (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_alpha_two_graph(num_of_codons, codons)
        return jsonify(graph), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/codons-list-alpha-three", methods=["POST", "OPTIONS"])
def get_codons_list_alpha_three():
    """Get the alpha-three codon graph (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_alpha_three_graph(num_of_codons, codons)
        return jsonify(graph), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/eigenschaften", methods=["POST", "OPTIONS"])
def get_eigenschaften():
    """Get properties for original codons (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        properties = properties_service.get_original_properties(num_of_codons, codons)
        return jsonify(properties), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/eigenschaften-alpha-one", methods=["POST", "OPTIONS"])
def get_eigenschaften_alpha_one():
    """Get properties for alpha-one codons (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        properties = properties_service.get_alpha_one_properties(num_of_codons, codons)
        return jsonify(properties), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/eigenschaften-alpha-two", methods=["POST", "OPTIONS"])
def get_eigenschaften_alpha_two():
    """Get properties for alpha-two codons (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        properties = properties_service.get_alpha_two_properties(num_of_codons, codons)
        return jsonify(properties), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/eigenschaften-alpha-three", methods=["POST", "OPTIONS"])
def get_eigenschaften_alpha_three():
    """Get properties for alpha-three codons (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        properties = properties_service.get_alpha_three_properties(num_of_codons, codons)
        return jsonify(properties), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/eigenschaften-c3", methods=["POST", "OPTIONS"])
def get_eigenschaften_c3():
    """Get C3 properties for codons (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        c3_result = properties_service.get_c3_properties(num_of_codons, codons)
        return str(c3_result), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@legacy_bp.route("/longest-path", methods=["POST", "OPTIONS"])
def get_longest_path():
    """Calculate longest path in the graph (legacy route)."""
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        if not data or "codons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        edges = data["codons"]
        num_nodes = len(set([item for edge in edges for item in edge if len(edge) >= 2]))
        
        # Use the graph service which utilizes processing_utils.py
        longest_path_result = graph_service.get_longest_path(num_nodes, edges)
        return jsonify(longest_path_result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
