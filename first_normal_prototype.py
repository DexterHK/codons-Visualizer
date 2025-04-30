import pandas as pd
import pprint
import os
import glob
import json
from collections import defaultdict


# Works for 4 only
def process_codons_2_2(codons: list) -> dict:
    codon_length = len(codons[0])
    if codon_length != 4:
        return
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
                default_rows.append((i, codon[0] + codon[1], codon[1:]))
        else:
            count = 0
            for i, codon in items:
                if count < 2:
                    default_rows.append((i, codon[0] + codon[1], codon[1:]))
                    count += 1
                else:
                    if prefix in suffix_map:
                        order_index = min(suffix_map[prefix])
                        connection_rows.append((order_index, codon[:2], codon[2]))
                        break
                    else:
                        default_rows.append((i, codon[0] + codon[1], codon[1:]))
                        count += 1

    all_rows = []
    for order, left, right in default_rows:
        all_rows.append((order, 0, left, right))
    for order, left, right in connection_rows:
        all_rows.append((order, 1, left, right))
    all_rows.sort(key=lambda x: (x[0], x[1]))

    output_rows = [[left, right] for _, _, left, right in all_rows]
    return {"rows": output_rows}


# Works for 4 and 3
# GTTAATAGTGAAGCAGTTCATCCTCGTCTACAACCA
def process_codons_rest_1(codons: list) -> dict:
    codon_length = len(codons[0])
    if codon_length > 5 or codon_length < 2:
        return {"rows": []}

    groups = {}
    for i, codon in enumerate(codons):
        # Group based on the substring from index 2 to the end
        prefix = codon[2:]
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
                # Use first two letters and the last character as before
                default_rows.append((i, codon[:2], codon[-1:]))
        else:
            count = 0
            for i, codon in items:
                if count < 2:
                    default_rows.append((i, codon[:2], codon[-1:]))
                    count += 1
                else:
                    if prefix in suffix_map:
                        order_index = min(suffix_map[prefix])
                        connection_rows.append((order_index, codon[:2], codon[2:]))
                        break
                    else:
                        default_rows.append((i, codon[:2], codon[-1:]))
                        count += 1

    all_rows = []
    for order, left, right in default_rows:
        all_rows.append((order, 0, left, right))
    for order, left, right in connection_rows:
        all_rows.append((order, 1, left, right))
    all_rows.sort(key=lambda x: (x[0], x[1]))

    output_rows = [[left, right] for _, _, left, right in all_rows]
    return {"rows": output_rows}

    # Works for 2,3,4


def process_codons_1_rest(codons: list) -> dict:
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
                        connection_rows.append((order_index, codon[:2], codon[2:]))
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


def remove_backslashes(s: str) -> str:
    return s.replace("\n", "")


def parseinput(codon_length: int, codons: str) -> list:
    if codon_length > 4 or codon_length < 1:
        return []
    codonsy = remove_spaces(codons)
    codonsy = remove_backslashes(codonsy)
    return [codonsy[i : i + codon_length] for i in range(0, len(codonsy), codon_length)]


# ---------------------
# From paper_1
# ---------------------


def get_complement(nucleotide: str) -> str:
    # Ensure we work with uppercase letters
    mapping = {"A": "T", "T": "A", "C": "G", "G": "C"}
    nucleotide = nucleotide.upper()
    # Retrieve the complement using the mapping
    try:
        return mapping[nucleotide]
    except KeyError:
        raise ValueError(f"Invalid nucleotide: {nucleotide}")


def complement(sequence: str) -> str:
    # Use a list comprehension to get each complement and join them into a new string
    return "".join(get_complement(nuc) for nuc in sequence)


def is_self_complementary(codons) -> bool:
    return all(complement(codon) in codons for codon in codons)


# 3. Check if the codon set is maximal self-complementary.
# (It is known that any self-complementary code can have at most 20 codons.)
def is_maximal_self_complementary(codons) -> bool:
    """
    Returns True if codons is self-complementary and has maximal size (20 codons).
    """
    return len(codons) == 20 and is_self_complementary(codons)

# GCA GCC GCG GCT TGC TGT GAC GAT GAA GAG CGT CGG CGC CGA ACG ACA CTG CTA CTT CTC
# CGT CGG CGC CGA ACG ACA CTG CTA CTT CTC



def word_length(code):
    """Assumes all words in code have the same length. Returns that length."""
    for word in code:
        return len(word)
    return 0


def is_comma_free(code) -> bool:
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


def is_duplicate_free(code) -> bool:
    """
    Returns True if the given iterable 'code' has no duplicates.
    (If code is already a set, this is automatically True.)
    """
    code_list = list(code)
    return len(code_list) == len(set(code_list))

# ----------------------------------------------------------------
# If you have a cycle-coloring function, run it here (optional).
# ----------------------------------------------------------------
def all_cycles(edge_list):
    from collections import defaultdict
    graph = defaultdict(list)
    for u, v in edge_list:
        graph[u].append(v)

    cycles = set()
    stack  = []

    def dfs(node, start):
        stack.append(node)
        for nxt in graph.get(node, []):          # ← no side‑effect
            if nxt == start and len(stack) > 1:
                cycles.add(tuple(stack + [start]))
            elif nxt not in stack:
                dfs(nxt, start)
        stack.pop()

    for v in list(graph):                        # list() is now optional
        dfs(v, v)
    
    # Filter the tuples that are exactly 3, because A -> B -> A or B -> A -> B. Which are essentially not a real circle
    cycles = {c for c in cycles if len(c) > 3}

    return cycles


def export_csv(number_of_codons, codons):
    parsed_input = parseinput(number_of_codons, codons)
    all_rows = process_codons_1_rest(parsed_input)
    all_rows_without_rows = all_rows["rows"]
    return all_rows_without_rows

''' 
def merge_rows(dict1, dict2):
    # Create a set of tuples for the rows in dict2 for fast lookup.
    existing = {tuple(row) for row in dict2["rows"]}
    # Loop over each pair in dict1["rows"]
    for row in dict1["rows"]:
        # If the pair doesn't exist in dict2, add it.
        if tuple(row) not in existing:
            dict2["rows"].append(row)
            existing.add(tuple(row))
    return dict2
'''

def merge_rows(dict1, dict2):
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
    parsed_input = parseinput(number_of_codons, codons)
    codons_broke_down = process_codons_1_rest(parsed_input)
    if number_of_codons == 3 or number_of_codons == 4:
        codons_broke_down3 = process_codons_rest_1(parsed_input)
        codons_broke_down = merge_rows(codons_broke_down, codons_broke_down3)
    if number_of_codons == 4:
        codons_broke_down2 = process_codons_2_2(parsed_input)
        codons_broke_down = merge_rows(codons_broke_down, codons_broke_down2)
    return codons_broke_down


# Example usage:
TEMP_INPUT = "GCAGCCGCGGCTTGCTGTGACGATGAAGAGTTCTTTGGAGGCGGGGGTCACCATATAATCATTAAAAAGCTACTCCTGCTTTTATTGATGAACAATCCACCCCCGCCTCAACAGAGAAGGCGACGCCGGCGTTAATAGTGAAGCAGTTCATCCTCGTCTACAACCACGACTGTAGTCGTGGTTTGGTACTAT"
TEMP_INPUT1 = "GCAGCCGCGGCTTGCTGTGACGATGAAGAG"
TEMP_INPUT2 = "CGTTAATAGTGAAGCAGTTCATCCTCGTCTACAACCA" "CGACTGTAGTCGTGGTTTGGTACTAT"
TEMP_INPUT3 = "CGTTAATAGTGAAGCAGTTCATCCTCGTCTACAACCA" "GCCTCAAC"
TEMP_INPUT4 = "TAATAG" "TGCCTCAAC"
TEMP_INPUT5 = "GTCGTGGTTTGGTTCATCCTCGTC"

def is_circular_code(number,codon_input):
    codons = last_parse(number,codon_input)
    return len(all_cycles(codons['rows'])) > 0



def properties(number, codon_input):
    """
    maximal self complementary = msc
    self complementary = sc
    circular code = cc
    comma-free = cf
    duplicate free = df
    """

    parsed_input = parseinput(number, codon_input)
    eigenshaften_parameter = {
        "maximal self complementary": is_maximal_self_complementary(parsed_input),
        "self complementary": is_self_complementary(parsed_input),
        "circular code": is_circular_code(number, codon_input),
        "comma-free": is_comma_free(parsed_input),
        "duplicate free": is_duplicate_free(parsed_input),
    }
    return eigenshaften_parameter


def properties_alpha_one(number, codon_input):
    """
    maximal self complementary = msc
    self complementary = sc
    circular code = cc
    comma-free = cf
    duplicate free = df
    """
    alpha_input = alph1(codon_input)
    parsed_input = parseinput(number, alpha_input)
    properties_parameter1 = {
        "maximal self complementary": is_maximal_self_complementary(parsed_input),
        "self complementary": is_self_complementary(parsed_input),
        "circular code": is_circular_code(number, codon_input),
        "comma-free": is_comma_free(parsed_input),
        "duplicate free": is_duplicate_free(parsed_input),
    }
    return properties_parameter1


def properties_alpha_two(number, codon_input):
    """
    maximal self complementary = msc
    self complementary = sc
    circular code = cc
    comma-free = cf
    duplicate free = df
    """
    alpha_input = alph2(codon_input)
    parsed_input = parseinput(number, alpha_input)
    properties_parameter2 = {
        "maximal self complementary": is_maximal_self_complementary(parsed_input),
        "self complementary": is_self_complementary(parsed_input),
        "circular code": is_circular_code(number, codon_input),
        "comma-free": is_comma_free(parsed_input),
        "duplicate free": is_duplicate_free(parsed_input),
    }
    return properties_parameter2


# Functions for Eigenschaften
def c3(number, codon_input):
    parsed_input = last_parse(number, codon_input)
    alpha_one = alph1(codon_input)
    alpha_two = alph2(codon_input)
    parsed_input_alpha_one = last_parse(number, alpha_one)
    parsed_input_alpha_two = last_parse(number, alpha_two)
    if (
        len(all_cycles(parsed_input['rows'])) > 0 and 
        len(all_cycles(parsed_input_alpha_one['rows'])) > 0 
        and len(all_cycles(parsed_input_alpha_two['rows'])) > 0 
    ):
        return True
    else:
        return False


def shift_string(s: str, shift: int) -> str:
    if not s:
        return s  # Return the empty string if input is empty

    # Calculate the effective shift using modulo, which handles shifts greater than the string length
    effective_shift = shift % len(s)

    return s[-effective_shift:] + s[:-effective_shift]


def alph1(s: str) -> str:
    return shift_string(s, 1)


def alph2(s: str) -> str:
    return shift_string(s, -1)


def get_graph(number_of_codons, codons):
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
    alpha_one_codons = alph1(codons)
    return get_graph(number_of_codons, alpha_one_codons)


def get_graph_alpha_two(number_of_codons, codons):
    alpha_two_codons = alph2(codons)
    return get_graph(number_of_codons, alpha_two_codons)


def longest_path(number,edge_list):
    """Return one longest simple path in a directed graph."""
    edge_list = last_parse(number,edge_list)
    edge_list = edge_list['rows']
    graph = defaultdict(list)
    for u, v in edge_list:
        graph[u].append(v)

    best = []                      # longest path found so far

    def dfs(node, visited, path):
        nonlocal best
        visited.add(node)
        path.append(node)
        if len(path) > len(best):   # record if better
            best = path.copy()

        for nxt in graph.get(node, []):   # .get avoids changing the dict
            if nxt not in visited:        # simple path: no repeats
                dfs(nxt, visited, path)

        path.pop()
        visited.remove(node)

    for start in list(graph):      # freeze keys so size can't change
        dfs(start, set(), [])
    return best