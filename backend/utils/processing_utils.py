"""
Utility functions for processing operations.
"""
from .codon_utils import parseinput

def get_component_graph(codons: list, component_index: int) -> dict:
    """
    Get the i-th component of the representing graph for a set of codons.
    
    For a codon of length n, component i (1 <= i <= n-1) splits each codon
    at position i, creating edges from the first i characters to the remaining characters.
    
    Args:
        codons: List of codons (all should have the same length)
        component_index: The component index (1-based, 1 <= i <= n-1)
        
    Returns:
        Dictionary with "rows" containing the edges as [source, target] pairs
    """
    if not codons:
        return {"rows": []}
    
    # Validate component index
    codon_length = len(codons[0])
    if component_index < 1 or component_index >= codon_length:
        return {"rows": []}
    
    # Create edges by splitting each codon at the component position
    edges = []
    for codon in codons:
        source = codon[:component_index]
        target = codon[component_index:]
        edges.append([source, target])
    
    return {"rows": edges}

def get_full_representing_graph(codons: list) -> dict:
    """
    Get the full representing graph for a set of codons.
    
    This creates edges for all possible splits of each codon.
    For a codon of length n, this creates n-1 edges per codon.
    
    Args:
        codons: List of codons (all should have the same length)
        
    Returns:
        Dictionary with "rows" containing all edges as [source, target] pairs
    """
    if not codons:
        return {"rows": []}
    
    codon_length = len(codons[0])
    all_edges = []
    
    # For each codon, create edges for all possible splits
    for codon in codons:
        for i in range(1, codon_length):
            source = codon[:i]
            target = codon[i:]
            all_edges.append([source, target])
    
    # Remove duplicates while preserving order
    seen = set()
    unique_edges = []
    for edge in all_edges:
        edge_tuple = tuple(edge)
        if edge_tuple not in seen:
            seen.add(edge_tuple)
            unique_edges.append(edge)
    
    return {"rows": unique_edges}

def process_codons_2_2(codons: list) -> dict:
    """Process codons using 2-2 breakdown (middle split for even-length codons)."""
    if not codons:
        return {"rows": []}
        
    codon_length = len(codons[0])
    
    # For 2-2 breakdown, we split at the middle
    if codon_length % 2 != 0:
        # For odd-length codons, we can't do a perfect 2-2 split
        # Use the closest to middle split
        split_pos = codon_length // 2
    else:
        # For even-length codons, split exactly in the middle
        split_pos = codon_length // 2
    
    return get_component_graph(codons, split_pos)

def process_codons_rest_1(codons: list) -> dict:
    """Process codons using rest-1 breakdown (split after first n-1 characters)."""
    if not codons:
        return {"rows": []}
        
    codon_length = len(codons[0])
    if codon_length < 2:
        return {"rows": []}
    
    # Split after the first n-1 characters (leaving 1 character on the right)
    split_pos = codon_length - 1
    return get_component_graph(codons, split_pos)

def process_codons_1_rest(codons: list) -> dict:
    """Process codons using 1-rest breakdown (split after first character)."""
    if not codons:
        return {"rows": []}
        
    codon_length = len(codons[0])
    if codon_length < 2:
        return {"rows": []}
    
    # Split after the first character
    split_pos = 1
    return get_component_graph(codons, split_pos)

def merge_rows(dict1, dict2):
    """Merge two dictionaries containing rows."""
    # Get the lists of pairs from each dictionary (default to empty list if missing)
    list1 = dict1.get("rows", [])
    list2 = dict2.get("rows", [])

    # Combine the two lists of pairs
    combined = list1 + list2

    # Use a set to store unique pairs (in uppercase)
    unique_pairs_set = set()
    unique_pairs_list = []
    for pair in combined:
        # Convert pair to a tuple of uppercase strings (for case-insensitive comparison)
        upper_pair = tuple(str(item).upper() for item in pair)
        if upper_pair not in unique_pairs_set:
            unique_pairs_set.add(upper_pair)
            unique_pairs_list.append(upper_pair)

    # Return the result in the desired format
    return {"rows": unique_pairs_list}

def last_parse(number_of_codons, codons):
    """Parse codons using multiple breakdown methods."""
    if not codons:
        return {"rows": []}

    parsed_input = parseinput(number_of_codons, codons)
    result = {"rows": []}

    # Always process the 1-rest breakdown
    codons_broke_down = process_codons_1_rest(parsed_input)
    result = merge_rows(result, codons_broke_down)

    # For 3 or 4 codons, add rest-1 breakdown
    if number_of_codons >= 3:
        codons_broke_down3 = process_codons_rest_1(parsed_input)
        result = merge_rows(result, codons_broke_down3)

    # For any number of codons, add 2-2 breakdown
    codons_broke_down2 = process_codons_2_2(parsed_input)
    if codons_broke_down2:  # Only merge if we got a result
        result = merge_rows(result, codons_broke_down2)

    return result
