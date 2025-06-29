"""
Utility functions for graph operations.
"""
from collections import defaultdict
from .codon_utils import alph1, alph2, alph3
from .processing_utils import (
    last_parse, get_component_graph, get_full_representing_graph,
    process_codons_1_rest, process_codons_2_2, process_codons_rest_1
)

def all_cycles(edge_list):
    """Find all cycles in a graph."""
    graph = defaultdict(list)
    for u, v in edge_list:
        graph[u].append(v)

    cycles = set()
    stack = []

    def dfs(node, start):
        stack.append(node)
        for nxt in graph.get(node, []):
            if nxt == start and len(stack) > 1:
                cycles.add(tuple(stack + [start]))
            elif nxt not in stack:
                dfs(nxt, start)
        stack.pop()

    for v in list(graph):
        dfs(v, v)
    
    # Filter the tuples that are exactly 3, because A -> B -> A or B -> A -> B. Which are essentially not a real circle
    cycles = {c for c in cycles if len(c) > 3}

    return cycles

def get_graph(number_of_codons, codons):
    """Get the original codon graph using processing_utils."""
    parsed_input = last_parse(number_of_codons, codons)

    nodes = list(
        filter(
            lambda y: len(y) > 0,
            {x[0] for x in parsed_input["rows"]} | {x[1] for x in parsed_input["rows"]},
        )
    )

    edges = list(
        filter(lambda x: len(x[0]) > 0 and len(x[1]) > 0, parsed_input["rows"])
    )
    
    graph = {"nodes": nodes, "edges": edges}
    return remove_isolated_nodes(graph)

def get_component_graph_direct(codons, component_index):
    """Get a specific component graph directly using processing_utils."""
    result = get_component_graph(codons, component_index)
    
    nodes = list(
        filter(
            lambda y: len(y) > 0,
            {x[0] for x in result["rows"]} | {x[1] for x in result["rows"]},
        )
    )

    edges = list(
        filter(lambda x: len(x[0]) > 0 and len(x[1]) > 0, result["rows"])
    )
    
    graph = {"nodes": nodes, "edges": edges}
    return remove_isolated_nodes(graph)

def get_full_graph_direct(codons):
    """Get the full representing graph directly using processing_utils."""
    result = get_full_representing_graph(codons)
    
    nodes = list(
        filter(
            lambda y: len(y) > 0,
            {x[0] for x in result["rows"]} | {x[1] for x in result["rows"]},
        )
    )

    edges = list(
        filter(lambda x: len(x[0]) > 0 and len(x[1]) > 0, result["rows"])
    )
    
    graph = {"nodes": nodes, "edges": edges}
    return remove_isolated_nodes(graph)

def get_1_rest_graph(codons):
    """Get 1-rest breakdown graph using processing_utils."""
    result = process_codons_1_rest(codons)
    
    nodes = list(
        filter(
            lambda y: len(y) > 0,
            {x[0] for x in result["rows"]} | {x[1] for x in result["rows"]},
        )
    )

    edges = list(
        filter(lambda x: len(x[0]) > 0 and len(x[1]) > 0, result["rows"])
    )
    
    graph = {"nodes": nodes, "edges": edges}
    return remove_isolated_nodes(graph)

def get_2_2_graph(codons):
    """Get 2-2 breakdown graph using processing_utils."""
    result = process_codons_2_2(codons)
    
    nodes = list(
        filter(
            lambda y: len(y) > 0,
            {x[0] for x in result["rows"]} | {x[1] for x in result["rows"]},
        )
    )

    edges = list(
        filter(lambda x: len(x[0]) > 0 and len(x[1]) > 0, result["rows"])
    )
    
    graph = {"nodes": nodes, "edges": edges}
    return remove_isolated_nodes(graph)

def get_rest_1_graph(codons):
    """Get rest-1 breakdown graph using processing_utils."""
    result = process_codons_rest_1(codons)
    
    nodes = list(
        filter(
            lambda y: len(y) > 0,
            {x[0] for x in result["rows"]} | {x[1] for x in result["rows"]},
        )
    )

    edges = list(
        filter(lambda x: len(x[0]) > 0 and len(x[1]) > 0, result["rows"])
    )
    
    graph = {"nodes": nodes, "edges": edges}
    return remove_isolated_nodes(graph)

def get_graph_alpha_one(number_of_codons, codons):
    """Get the alpha-one transformed codon graph."""
    alpha_one_codons = alph1(codons,number_of_codons)
    return get_graph(number_of_codons, alpha_one_codons)

def get_graph_alpha_two(number_of_codons, codons):
    """Get the alpha-two transformed codon graph."""
    alpha_two_codons = alph2(codons,number_of_codons)
    return get_graph(number_of_codons, alpha_two_codons)

def get_graph_alpha_three(number_of_codons, codons):
    """Get the alpha-three transformed codon graph."""
    alpha_three_codons = alph3(codons,number_of_codons)
    return get_graph(number_of_codons, alpha_three_codons)

def remove_isolated_nodes(graph_data):
    """Remove nodes that have no connections (isolated nodes) from the graph."""
    if not graph_data or "nodes" not in graph_data or "edges" not in graph_data:
        return graph_data
    
    nodes = graph_data["nodes"]
    edges = graph_data["edges"]
    
    # Get all nodes that are connected (appear in edges)
    connected_nodes = set()
    for edge in edges:
        if len(edge) >= 2:  # Ensure edge has at least source and target
            connected_nodes.add(edge[0])
            connected_nodes.add(edge[1])
    
    # Filter nodes to only include connected ones
    filtered_nodes = [node for node in nodes if node in connected_nodes]
    
    return {
        "nodes": filtered_nodes,
        "edges": edges
    }

def longest_path(number, edge_list):
    """Return one longest simple path in a directed graph using DFS with memoization."""
    if not edge_list:
        return []
    
    # Create a set of nodes from the edge list
    nodes = set()
    for edge in edge_list:
        # Handle both object format {source: ..., target: ...} and array format [source, target]
        if isinstance(edge, dict):
            source = edge.get('source')
            target = edge.get('target')
        else:
            source = edge[0]
            target = edge[1]
        
        if source and target:
            nodes.add(source)
            nodes.add(target)
    
    if not nodes:
        return []
    
    # Build adjacency list
    graph = {}
    for node in nodes:
        graph[node] = []
    
    for edge in edge_list:
        # Handle both object format {source: ..., target: ...} and array format [source, target]
        if isinstance(edge, dict):
            source = edge.get('source')
            target = edge.get('target')
        else:
            source = edge[0]
            target = edge[1]
        
        if source and target:
            graph[source].append(target)
    
    longest_path_found = []
    max_length = 0
    
    def dfs(node, path, visited):
        nonlocal longest_path_found, max_length
        
        if len(path) > max_length:
            max_length = len(path)
            longest_path_found = path.copy()
        
        # Explore neighbors
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                path.append(neighbor)
                dfs(neighbor, path, visited)
                path.pop()
                visited.remove(neighbor)
    
    # Try starting from each node
    for start_node in nodes:
        visited = {start_node}
        path = [start_node]
        dfs(start_node, path, visited)
    
    return longest_path_found
