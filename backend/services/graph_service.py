"""
Service for handling graph-related operations.
"""
from utils.graph_utils import (
    get_graph, get_graph_alpha_one, get_graph_alpha_two, 
    get_graph_alpha_three, longest_path, all_cycles, remove_isolated_nodes
)

class GraphService:
    """Service class for graph operations."""
    
    def __init__(self):
        pass
    
    def get_original_graph(self, number_of_codons: int, codons: list) -> dict:
        """Get the original codon graph with isolated nodes removed."""
        graph = get_graph(number_of_codons, codons)
        return remove_isolated_nodes(graph)
    
    def get_alpha_one_graph(self, number_of_codons: int, codons: list) -> dict:
        """Get the alpha-one transformed codon graph with isolated nodes removed."""
        graph = get_graph_alpha_one(number_of_codons, codons)
        return remove_isolated_nodes(graph)
    
    def get_alpha_two_graph(self, number_of_codons: int, codons: list) -> dict:
        """Get the alpha-two transformed codon graph with isolated nodes removed."""
        graph = get_graph_alpha_two(number_of_codons, codons)
        return remove_isolated_nodes(graph)
    
    def get_alpha_three_graph(self, number_of_codons: int, codons: list) -> dict:
        """Get the alpha-three transformed codon graph with isolated nodes removed."""
        graph = get_graph_alpha_three(number_of_codons, codons)
        return remove_isolated_nodes(graph)
    
    def get_longest_path(self, num_nodes: int, edges: list) -> dict:
        """Get the longest path in a graph."""
        return longest_path(num_nodes, edges)
    
    def get_all_cycles(self, edge_list: list) -> list:
        """Get all cycles in a graph."""
        return all_cycles(edge_list)
