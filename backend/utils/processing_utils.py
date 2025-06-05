"""
Utility functions for processing operations.
"""
from .codon_utils import parseinput

def process_codons_2_2(codons: list) -> dict:
    """Process codons for any length using 2-2 breakdown."""
    if not codons:
        return {"rows": []}
        
    codon_length = len(codons[0])
    half_length = codon_length // 2

    groups = {}
    suffix_map = {}
    
    # Group by prefix
    for i, codon in enumerate(codons):
        prefix = codon[:half_length]
        suffix = codon[-half_length:]
        groups.setdefault(prefix, []).append((i, codon))
        suffix_map.setdefault(suffix, []).append(i)

    default_rows = []
    connection_rows = []

    # Process each group
    for prefix, items in groups.items():
        items.sort(key=lambda x: x[0])
        if len(items) < 3:
            for i, codon in items:
                default_rows.append((i, codon[:half_length], codon[half_length:]))
        else:
            count = 0
            for i, codon in items:
                if count < 2:
                    default_rows.append((i, codon[:half_length], codon[half_length:]))
                    count += 1
                else:
                    if prefix in suffix_map:
                        order_index = min(suffix_map[prefix])
                        connection_rows.append((order_index, codon[:half_length], codon[half_length:]))
                        break
                    else:
                        default_rows.append((i, codon[:half_length], codon[half_length:]))
                        count += 1

    # Combine all rows
    all_rows = []
    for order, left, right in default_rows:
        all_rows.append((order, 0, left, right))
    for order, left, right in connection_rows:
        all_rows.append((order, 1, left, right))
    all_rows.sort(key=lambda x: (x[0], x[1]))

    # Return formatted rows
    return {"rows": [[left, right] for _, _, left, right in all_rows]}

def process_codons_rest_1(codons: list) -> dict:
    """Process codons using rest-1 breakdown."""
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

def process_codons_1_rest(codons: list) -> dict:
    """Process codons using 1-rest breakdown."""
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
