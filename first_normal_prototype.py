import pandas as pd
import networkx as nx
from pyvis.network import Network
import webbrowser
import os
import glob

def process_codons(codons: list) -> dict:
    codon_length = len(codons[0])
    groups = {}
    for i, codon in enumerate(codons):
        prefix = codon[:2]
        groups.setdefault(prefix, []).append((i, codon))

    suffix_map = {}
    for i, codon in enumerate(codons):
        suffix = codon[-2:]
        suffix_map.setdefault(suffix, []).append(i)

    default_rows = []
    connection_rows = []

    for prefix, items in groups.items():
        items.sort(key=lambda x: x[0])
        if len(items) < 3:
            for i, codon in items:
                default_rows.append((i, codon[0], codon[1:]))
        else:
            count = 0
            for i, codon in items:
                if count < 2:
                    default_rows.append((i, codon[0], codon[1:]))
                    count += 1
                else:
                    if prefix in suffix_map:
                        order_index = min(suffix_map[prefix])
                        if codon_length == 2:
                            connection_rows.append((order_index, codon[:1], codon[1]))
                        else:
                            connection_rows.append((order_index, codon[:2], codon[2]))
                        break
                    else:
                        default_rows.append((i, codon[0], codon[1:]))
                        count += 1

    all_rows = []
    for order, left, right in default_rows:
        all_rows.append((order, 0, left, right))
    for order, left, right in connection_rows:
        all_rows.append((order, 1, left, right))
    all_rows.sort(key=lambda x: (x[0], x[1]))

    output_rows = [[left, right] for _, _, left, right in all_rows]
    return {"rows": output_rows}

def remove_spaces(s: str) -> str:
    return s.replace(" ", "")

def parseinput(codon_length: int, codons: str) -> list:
    if codon_length > 4 or codon_length < 1:
        return []
    codonsy = remove_spaces(codons)
    return [codonsy[i:i+codon_length] for i in range(0, len(codonsy), codon_length)]


#---------------------
# From paper_1
#---------------------
def complement(codon):
    mapping = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    return ''.join(mapping[nuc] for nuc in codon)

# 2. Check if a set of codons is self-complementary.
def is_self_complementary(codons):
    """
    Returns True if for every codon in the set, its complement is also in the set.
    """
    for codon in codons:
        if complement(codon) not in codons:
            return False
    return True

# 3. Check if the codon set is maximal self-complementary.
# (It is known that any self-complementary code can have at most 20 codons.)
def is_maximal_self_complementary(codons):
    """
    Returns True if codons is self-complementary and has maximal size (20 codons).
    """
    return len(codons) == 20 and is_self_complementary(codons)


#--------------------------
# Building a graph to check after Circularity
#------------------------
def build_graph_from_code(code):
    """
    Build a directed graph from a given code.
    
    Parameters:
        code (iterable of str): A collection of words (e.g. codons) 
            all of the same fixed length L.
    
    Returns:
        dict: A dictionary representing the directed graph.
              Keys are vertices (strings of length L-1),
              and values are lists of neighboring vertices.
    
    Construction:
      For each word in the code:
        - Let prefix = word[:-1]  (all but the last character)
        - Let suffix = word[1:]   (all but the first character)
        - Add a directed edge from prefix to suffix.
    """
    graph = {}
    for word in code:
        # We require words to be at least of length 2
        if len(word) < 2:
            continue
        prefix = word[:-1]
        suffix = word[1:]
        # Add the edge from prefix to suffix
        if prefix not in graph:
            graph[prefix] = []
        graph[prefix].append(suffix)
        # Ensure that suffix exists as a vertex even if it has no outgoing edge
        if suffix not in graph:
            graph[suffix] = []
    return graph

def has_cycle_util(v, visited, rec_stack, graph):
    """
    A helper function for cycle detection using DFS.
    
    Parameters:
        v (str): The current vertex.
        visited (set): Set of vertices already visited.
        rec_stack (set): Set of vertices in the current recursion stack.
        graph (dict): The directed graph.
    
    Returns:
        bool: True if a cycle is found starting from vertex v.
    """
    visited.add(v)
    rec_stack.add(v)
    for neighbor in graph.get(v, []):
        if neighbor not in visited:
            if has_cycle_util(neighbor, visited, rec_stack, graph):
                return True
        elif neighbor in rec_stack:
            # A neighbor in the recursion stack indicates a cycle.
            return True
    rec_stack.remove(v)
    return False

def has_cycle(graph):
    """
    Check if the directed graph contains any cycle.
    
    Parameters:
        graph (dict): The directed graph.
    
    Returns:
        bool: True if the graph has a cycle, False otherwise.
    """
    visited = set()
    rec_stack = set()
    for vertex in graph:
        if vertex not in visited:
            if has_cycle_util(vertex, visited, rec_stack, graph):
                return True
    return False

def is_circular_code(code):
    """
    Determines if a given code (list of codons or words) is circular.
    
    A code is defined as circular if, when you build the associated directed graph 
    (where each word of length L gives an edge from its prefix (first L-1 letters) 
    to its suffix (last L-1 letters)), the graph has no directed cycles.
    
    Parameters:
        code (iterable of str): A collection of words (e.g., codons) of fixed length.
    
    Returns:
        bool: True if the code is circular, False otherwise.
    
    Step-by-Step:
      1. Check that the code is not empty.
      2. Ensure all words have the same length L.
      3. Build the graph G(X):
           - For each word, compute prefix = word[:-1] and suffix = word[1:].
           - Add a directed edge from prefix to suffix.
      4. Use a depth-first search (DFS) based cycle detection algorithm to check if G(X)
         contains any cycle.
      5. If G(X) is acyclic, return True (the code is circular); otherwise, return False.
    """
    # Return False if the code is empty.
    if not code:
        return False

    # Determine the word length (assume all words have the same length)
    L = len(next(iter(code)))
    if any(len(word) != L for word in code):
        print("The length are not equal!")
        return False
    
    # Build the graph from the code.
    graph = build_graph_from_code(code)
    print(graph)
    # The code is circular if the graph is acyclic.
    return not has_cycle(graph)



def word_length(code):
    """Assumes all words in code have the same length. Returns that length."""
    for word in code:
        return len(word)
    return 0

def is_comma_free(code):
    """
    For a block code (all words of length L), returns True if the code is comma-free.
    That is, for every two words u and v in the code and for every nonzero shift r (1 <= r < L),
    the string formed by u[r:] + v[:r] is not in the code.
    """
    if not code:
        return False
    L = word_length(code)
    for u in code:
        for v in code:
            # For every nonzero split of u and v
            for r in range(1, L):
                candidate = u[r:] + v[:r]
                if candidate in code:
                    return False
    return True

def is_duplicate_free(code):
    """
    Returns True if the given iterable 'code' has no duplicates.
    (If code is already a set, this is automatically True.)
    """
    code_list = list(code)
    return len(code_list) == len(set(code_list))



# ----------------------------------------------------------------
# If you have a cycle-coloring function, run it here (optional).
# ----------------------------------------------------------------
def detect_cycles(graph):
    cycles = []
    def all_neighbors(n):
        return set(graph.successors(n)).union(set(graph.predecessors(n)))
    def dfs(start, current, path):
        for neighbor in all_neighbors(current):
            if neighbor == start and len(path) >= 3:
                cycles.append(path + [start])
            elif neighbor not in path:
                dfs(start, neighbor, path + [neighbor])
    for nd in graph.nodes():
        dfs(nd, nd, [nd])
    return cycles

def color_the_circle_black(graph, net):
    found_cycles = detect_cycles(graph)
    cycle_nodes = set()
    for cycle in found_cycles:
        for nd in cycle:
            cycle_nodes.add(nd)
    for node in net.nodes:
        if node['id'] in cycle_nodes:
            node['color'] = 'black'



def draw_arrows(net: Network):
    combined_edges = []
    processed_keys = set()
    for edge in net.edges:
        u = edge["from"]
        v = edge["to"]
        key = frozenset([u, v])
        if key in processed_keys:
            continue
        reciprocal_found = any(e for e in net.edges if e["from"] == v and e["to"] == u)
        if reciprocal_found:
            new_edge = {
                "from": u,
                "to": v,
                "arrows": {"to": True, "from": True},
                "title": edge.get("title", "")
            }
            combined_edges.append(new_edge)
        else:
            edge["arrows"] = {"to": True}
            combined_edges.append(edge)
        processed_keys.add(key)
    return combined_edges



def set_up_graph(number_of_codons,codons):
    parsed_input = parseinput(number_of_codons, codons)
    codons_broke_down = process_codons(parsed_input)
    all_rows = codons_broke_down["rows"]

    df_edges = pd.DataFrame(all_rows, columns=["from", "to"])

    G = nx.from_pandas_edgelist(df_edges,
                                source='from',
                                target='to',
                                create_using=nx.DiGraph())

    net = Network(
        notebook=False,
        directed=True,
        cdn_resources='in_line',
        height='1000px',
        width='100%'
    )

    # ----------------------------------------------------------------
    # Add nodes WITHOUT assigning x,y coords so PyVis can do the layout.
    # ----------------------------------------------------------------
    for node in G.nodes():
        net.add_node(node, label=str(node))
    
    combined_edges = draw_arrows(net)
    net.edges = combined_edges
    color_the_circle_black(G,net)

    # Import edges into PyVis.
    net.from_nx(G)
    # ----------------------------------------------------------------
    # Enable physics and allow free dragging of nodes.
    # Key: "stabilization": { "enabled": false } so nodes don't snap back.
    # ----------------------------------------------------------------
    options = '''
    {
    "nodes": {
        "borderWidthSelected": 21,
        "font": {
        "size": 30,
        "face": "verdana"
        }
    },
    "edges": {
        "smooth": {
        "enabled": true,
        "type": "dynamic",
        "forceDirection": "none",
        "roundness": 0.5
        }
    },
    "interaction": {
        "dragNodes": true,
        "dragView": true,
        "zoomView": true
    },
    "physics": {
        "enabled": true,
        "solver": "forceAtlas2Based",
        "stabilization": {
        "enabled": false
        }
    }
    }
    '''
    net.set_options(options)

    html_content = net.generate_html(notebook=False)

    return html_content

# Example usage:
TEMP_INPUT = (
    "GCAGCCGCGGCTTGCTGTGACGATGAAGAGTTCTTTGGAGGCGGGGGTCACCATATAATCATTAAAAAGCTACTCCTGCTTTTATTGATGAACAATCCACCCCCGCCTCAACAGAGAAGGCGACGCCGGCGTTAATAGTGAAGCAGTTCATCCTCGTCTACAACCACGACTGTAGTCGTGGTTTGGTACTAT"
)
TEMP_INPUT1 = (
    "GCAGCCGCGGCTTGCTGTGACGATGAAGAG"
)
TEMP_INPUT2 = (
    "CGTTAATAGTGAAGCAGTTCATCCTCGTCTACAACCA"
    "CGACTGTAGTCGTGGTTTGGTACTAT"
)
TEMP_INPUT3 = (
    "CGTTAATAGTGAAGCAGTTCATCCTCGTCTACAACCA"
    "GCCTCAAC"
)
TEMP_INPUT4 = (
    "TAATAG"
    "TGCCTCAAC"
)
TEMP_INPUT5 = (
    "GTCGTGGTTTGGTTCATCCTCGTC"
)
TEMP_INPUT5 = (
    "GTCGTGGTTTGGTTCATCCTCGTC"
)




def delete_files():
    folder = 'templates'
    existing_files = glob.glob(os.path.join(folder, "codons_list*.html"))
    file_number = len(existing_files)
    
    if(file_number > 0):
        for file in existing_files:
            print("files:",file)
            os.remove(file)



def automation(number,codon_input):
    delete_files()
    parsed_input = parseinput(number, codon_input)
    print(parsed_input)
    print("is it maximal self complementary:",is_maximal_self_complementary(parsed_input))
    print("is it self complementary:",is_self_complementary(parsed_input))
    print("is circular:",is_circular_code(parsed_input))
    print("is it comma-free:", is_comma_free(parsed_input))
    print("is it duplicate free:",is_duplicate_free(parsed_input))
    return set_up_graph(number,codon_input)
    