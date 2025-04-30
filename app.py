from flask import Flask, Response, request, render_template, jsonify
from first_normal_prototype import  get_graph , get_graph_alpha_one , get_graph_alpha_two, longest_path ,properties , properties_alpha_one ,properties_alpha_two ,c3
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def index():
    return render_template("input.html")



# API route to to analyze codons
# Input: JSON object with 'codons' and 'number_of_codons' keys
# Output: JSON object with 'nodes' and 'edges' keys
@app.route("/codons-list", methods=["POST"])
def analysis():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data:
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    graph = get_graph(int(number_of_codons), codons)

    return jsonify(graph), 201



@app.route("/codons-list-alpha-one", methods=["POST"])
def analysis_alpha_one():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data:
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    graph = get_graph_alpha_one(int(number_of_codons), codons)

    return jsonify(graph), 201


@app.route("/codons-list-alpha-two", methods=["POST"])
def analysis_alpha_two():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data:
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    graph = get_graph_alpha_two(int(number_of_codons), codons)

    return jsonify(graph), 201

@app.route("/eigenschaften", methods=["POST"])
def propertiesApp():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data: 
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    properties_input = properties(int(number_of_codons), codons)
    print("FUUUUUUUUUUUUUUUUUUUUUU",properties_input)
    return jsonify(properties_input), 201

@app.route("/eigenschaften-alpha-one", methods=["POST"])
def properties_alpha_one_api():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data:
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    properties_one = properties_alpha_one(int(number_of_codons), codons)
    print("ONEEEEEEEEEEEEEEEEE",properties_one)
    return jsonify(properties_one), 201

@app.route("/eigenschaften-alpha-two", methods=["POST"])
def properties_alpha_two_api():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data:
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    properties_two = properties_alpha_two(int(number_of_codons), codons)
    print("TWOOOOOOOOOOOOOOO",properties_two)

    return jsonify(properties_two), 201

@app.route("/eigenschaften-c3", methods=["POST"])
def c3_api():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data:
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    c3_input = c3(int(number_of_codons),codons)

    return str(c3_input), 201

@app.route("/longest-path", methods=["POST"])
def longest_path_api():
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "codons" not in data or "numOfCodons" not in data:
        return jsonify({"error": "No data found"}), 400

    codons = data["codons"]
    number_of_codons = data["numOfCodons"]

    longest_path_input = longest_path(int(number_of_codons),codons)

    return str(longest_path_input), 201