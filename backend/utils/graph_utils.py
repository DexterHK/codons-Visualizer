"""
Utility functions for graph operations.
"""
from collections import defaultdict
from .codon_utils import alph1, alph2, alph3
from .processing_utils import last_parse

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
    """Get the original codon graph."""
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
    
    return {"nodes": nodes, "edges": edges}

def get_graph_alpha_one(number_of_codons, codons):
    """Get the alpha-one transformed codon graph."""
    alpha_one_codons = alph1(codons)
    return get_graph(number_of_codons, alpha_one_codons)

def get_graph_alpha_two(number_of_codons, codons):
    """Get the alpha-two transformed codon graph."""
    alpha_two_codons = alph2(codons)
    return get_graph(number_of_codons, alpha_two_codons)

def get_graph_alpha_three(number_of_codons, codons):
    """Get the alpha-three transformed codon graph."""
    alpha_three_codons = alph3(codons)
    return get_graph(number_of_codons, alpha_three_codons)

def longest_path(number, edge_list):
    """Return one longest simple path in a directed graph using DFS with memoization."""
    if not edge_list:
        return []
    
    # Create a set of nodes from the edge list
    nodes = set()
    for edge in edge_list:
        nodes.add(edge[0])
        nodes.add(edge[1])
    
    if not nodes:
        return []
    
    # Build adjacency list
    graph = {}
    for node in nodes:
        graph[node] = []
    
    for edge in edge_list:
        graph[edge[0]].append(edge[1])
    
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
