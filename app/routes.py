from flask import Blueprint, jsonify, request, render_template
import networkx as nx
from .algorithms.bfs import bfs_with_target
from .algorithms.dfs import dfs_with_target

graph_bp = Blueprint('graph', __name__)
Graph = nx.Graph()

@graph_bp.route("/")
def index():
    return render_template("index.html")

@graph_bp.route("/create_graph", methods=["POST"])
def create_graph():
    data = request.get_json()
    nodes = data["nodes"]
    edges = data["edges"]

    Graph.clear()
    Graph.add_nodes_from(nodes)
    Graph.add_edges_from(edges)

    return jsonify({"message": "Graph created successfully!"})

@graph_bp.route("/run_algorithm", methods=["POST"])
def run_algorithm():
    algorithm = request.json.get("algorithm")
    start_node = request.json.get("start_node")
    target_node = request.json.get("target_node")
    
    if algorithm == "BFS":
        visited, path = bfs_with_target(Graph, start_node, target_node)
    elif algorithm == "DFS":
        visited, path = dfs_with_target(Graph, start_node, target_node)
    
    return jsonify({"visited": visited, "path": path})