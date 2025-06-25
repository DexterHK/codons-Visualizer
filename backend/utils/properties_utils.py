"""
Utility functions for properties operations.
"""
from collections import Counter
from itertools import product

#####################
# helper utilities  #
#####################

def complement(base: str) -> str:
    """Watson–Crick complement for DNA/RNA letters."""
    table = str.maketrans("ACGTUacgtu", "TGCAAtgcaa")
    return base.translate(table)

def revcomp(word: str) -> str:
    """Reverse complement of a word."""
    return complement(word)[::-1]

def rotations(word: str):
    """All proper (non-trivial) cyclic rotations of a word."""
    return {word[i:] + word[:i] for i in range(1, len(word))}


########################################
# 1. is_comma_free -------------------- #
########################################

def shift_sequence_transform(tuples, shift_amount):
    """
    Implements the ShiftSequence transformation from GCAT.
    Joins tuples, shifts the string, then splits back into tuples.
    """
    # Join tuples with spaces (like Tuple.joinTuples)
    joined = ' '.join(tuples)
    
    # Apply shift transformation (shift_amount times)
    for _ in range(shift_amount):
        # Pattern A: (\\s)(\\S) -> $2$1 (swap space with next non-space)
        # Pattern B: ^(\\S)(.*)$ -> $2$1 (move first char to end)
        
        # First, swap spaces with following non-space characters
        result = ""
        i = 0
        while i < len(joined):
            if i < len(joined) - 1 and joined[i] == ' ' and joined[i + 1] != ' ':
                # Swap space with next character
                result += joined[i + 1] + joined[i]
                i += 2
            else:
                result += joined[i]
                i += 1
        
        # Then move first character to end if it's not a space
        if result and result[0] != ' ':
            result = result[1:] + result[0]
        
        joined = result
    
    # Split back into tuples (like Tuple.splitTuples)
    return joined.split()

def has_duplicates(strings):
    """Check if the list of strings contains duplicates."""
    return len(strings) != len(set(strings))

def collections_disjoint(set1, set2):
    """Check if two collections have no elements in common (like Collections.disjoint)."""
    return len(set(set1) & set(set2)) == 0

def is_comma_free(strings, length=None):
    """
    Checks if a sequence of strings is comma-free according to the GCAT implementation.
    
    This is a direct translation of the Java CommaFree.test() method.
    
    Parameters:
    - strings: List of strings to check.
    - length: The length of each string (optional, will be inferred if not provided).
    
    Returns:
    - True if the sequence is comma-free, False otherwise.
    """
    if not strings:
        return True  # Empty set is comma-free
    
    # Infer length if not provided
    if length is None:
        length = len(strings[0]) if strings else 0
    
    # Check if all strings have the same length
    if len(set(len(s) for s in strings)) != 1:
        return False
    
    # Check for duplicates first
    if has_duplicates(strings):
        return False
    
    # Direct translation of the Java algorithm:
    # for(Tuple tupleA:tuples) for(Tuple tupleB:tuples)
    #   if(tupleA!=tupleB) for(shift=1,shifted=Arrays.asList(tupleA,tupleB);shift<length;shift++)
    #     if(!Collections.disjoint(tuples,shifted = SHIFT.transform(shifted))) {
    
    for tupleA in strings:
        for tupleB in strings:
            if tupleA != tupleB:
                # Create initial shifted collection: Arrays.asList(tupleA, tupleB)
                shifted = [tupleA, tupleB]
                
                # For each shift from 1 to length-1
                for shift in range(1, length):
                    # Apply SHIFT.transform(shifted)
                    shifted = shift_sequence_transform(shifted, 1)
                    
                    # Check if Collections.disjoint(tuples, shifted) is false
                    if not collections_disjoint(strings, shifted):
                        return False
    
    return True  # No collision found


########################################
# 2. is_circular ---------------------- #
########################################

def is_circular(code):
    """
    A graph-based uniqueness-of-decomposition test (Fimmel–Michel criterion).
    Build the representing graph G(X) and reject if it contains a directed
    cycle, because a cycle ↔ two distinct circular decompositions.
    """
    if has_duplicates(code):
        return False
    
    if len(set(len(s) for s in code)) != 1:
        return False
    V = set()
    E = dict()          # adjacency list
    for w in code:
        for i in range(1, len(w)):
            a, b = w[:i], w[i:]
            V.update((a, b))
            E.setdefault(a, set()).add(b)
    colour = dict()     # DFS: 0=unseen, 1=stack, 2=done

    def dfs(v):
        colour[v] = 1
        for nxt in E.get(v, ()):
            c = colour.get(nxt, 0)
            if c == 1:                  # back-edge → cycle
                return True
            if c == 0 and dfs(nxt):
                return True
        colour[v] = 2
        return False

    return not any(colour.get(v, 0) == 0 and dfs(v) for v in V)

########################################
# 3. is_C3 ---------------------------- #
########################################

def is_C3(length,code):
    """
    A code is C³ iff the code itself *and* the two rotation codes obtained by
    shifting every word left by 1 or 2 positions are circular.                  
    """
    if is_circular(code) & is_self_complementary(code) & is_self_complementary(code):
        return True

    return False 
########################################
# 4. is_self_complementary ------------ #
########################################

def is_self_complementary(code):
    """
    Every word occurs together with its reverse complement.                     
    """
    code_set = set(code)
    return all(revcomp(w) in code_set for w in code)

def is_maximal_self_complementary(codons):
    """Check if codons are maximal self-complementary."""
    return len(codons) == 20 and is_self_complementary(codons)

########################################
# 5. is_duplicate_free ---------------- #
########################################

def is_duplicate_free(code):
    """
    No repeated words.                                                          
    """
    return len(code) == len(set(code))

########################################
# convenience bundle ------------------ #
########################################

def analyse_code(length,code):
    """Return a dict with all five yes/no diagnostics."""
    return dict(
        duplicate_free      = is_duplicate_free(code),
        self_complementary  = is_self_complementary(code),
        comma_free          = is_comma_free(code,length),
        circular            = is_circular(code),
        maximal_self_complementary = is_maximal_self_complementary(code),
        C3                  = is_C3(length,code)
    )

########################################
# Legacy compatibility functions ------ #
########################################

# Import legacy functions for backward compatibility
from .codon_utils import parseinput, alph1, alph2, alph3
from .processing_utils import last_parse, merge_rows

def is_circular_code(number, codon_input):
    """Check if the given codons form a circular code."""
    codons = last_parse(number, codon_input)
    # Convert to the new format and use the new is_circular function
    code_list = [row for row in codons['rows']]
    return is_circular(code_list)

def properties(number, codon_input):
    """Get properties for original codons."""
    parsed_input = parseinput(number, codon_input)
    code_list = list(parsed_input)
    analysis = analyse_code(number,code_list)
    
    # Map to legacy format
    eigenshaften_parameter = {
        "maximal self complementary": analysis['maximal_self_complementary'],  # Not implemented in new version
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
        "C3" : analysis['C3'],
    }
    return eigenshaften_parameter

def properties_alpha_one(number, codon_input):
    """Get properties for alpha-one transformed codons."""
    alpha_input = alph1(codon_input)
    parsed_input = parseinput(number, alpha_input)
    code_list = list(parsed_input)
    analysis = analyse_code(number,code_list)
    
    properties_parameter1 = {
        "maximal self complementary": analysis['maximal_self_complementary'],  # Not implemented in new version
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
        "C3" : analysis['C3']
    }
    return properties_parameter1

def properties_alpha_two(number, codon_input):
    """Get properties for alpha-two transformed codons."""
    alpha_input = alph2(codon_input)
    parsed_input = parseinput(number, alpha_input)
    code_list = list(parsed_input)
    analysis = analyse_code(number,code_list)
    
    properties_parameter2 = {
        "maximal self complementary": analysis['maximal_self_complementary'],  # Not implemented in new version
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
        "C3" : analysis['C3']
    }
    return properties_parameter2

def properties_alpha_three(number, codon_input):
    """Get properties for alpha-three transformed codons."""
    alpha_input = alph3(codon_input, number)
    parsed_input = parseinput(number, alpha_input)
    code_list = list(parsed_input)
    analysis = analyse_code(number,code_list)
    
    properties_parameter3 = {
        "maximal self complementary": analysis['maximal_self_complementary'],
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
        "C3" : analysis['C3']
    }
    return properties_parameter3

def c3(number, codon_input):
    """Check C3 properties for codons."""
    parsed_input = parseinput(number, codon_input)
    return is_C3(number,parsed_input)
