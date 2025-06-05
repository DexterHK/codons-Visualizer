from flask import Blueprint, request, jsonify
from services.codon_service import CodonService
from services.graph_service import GraphService
from services.properties_service import PropertiesService

api_bp = Blueprint('api', __name__)

# Initialize services
codon_service = CodonService()
graph_service = GraphService()
properties_service = PropertiesService()

@api_bp.route("/graphs/original", methods=["POST"])
def get_original_graph():
    """Get the original codon graph."""
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_original_graph(num_of_codons, codons)
        return jsonify(graph), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/graphs/alpha-one", methods=["POST"])
def get_alpha_one_graph():
    """Get the alpha-one codon graph."""
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_alpha_one_graph(num_of_codons, codons)
        return jsonify(graph), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/graphs/alpha-two", methods=["POST"])
def get_alpha_two_graph():
    """Get the alpha-two codon graph."""
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_alpha_two_graph(num_of_codons, codons)
        return jsonify(graph), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/graphs/alpha-three", methods=["POST"])
def get_alpha_three_graph():
    """Get the alpha-three codon graph."""
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        graph = graph_service.get_alpha_three_graph(num_of_codons, codons)
        return jsonify(graph), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/properties/original", methods=["POST"])
def get_original_properties():
    """Get properties for original codons."""
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

@api_bp.route("/properties/alpha-one", methods=["POST"])
def get_alpha_one_properties():
    """Get properties for alpha-one codons."""
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

@api_bp.route("/properties/alpha-two", methods=["POST"])
def get_alpha_two_properties():
    """Get properties for alpha-two codons."""
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

@api_bp.route("/properties/alpha-three", methods=["POST"])
def get_alpha_three_properties():
    """Get properties for alpha-three codons."""
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

@api_bp.route("/properties/c3", methods=["POST"])
def get_c3_properties():
    """Get C3 properties for codons."""
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        codons = data["codons"]
        num_of_codons = int(data["numOfCodons"])

        c3_result = properties_service.get_c3_properties(num_of_codons, codons)
        return str(c3_result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/graphs/longest-path", methods=["POST"])
def get_longest_path():
    """Get the longest path in a graph."""
    try:
        data = request.json
        if not data or "codons" not in data or "numOfCodons" not in data:
            return jsonify({"error": "Missing required data"}), 400

        edges = data["codons"]  # This should be the direct edges array
        num_nodes = int(data["numOfCodons"])
        
        longest_path_result = graph_service.get_longest_path(num_nodes, edges)
        return jsonify(longest_path_result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
