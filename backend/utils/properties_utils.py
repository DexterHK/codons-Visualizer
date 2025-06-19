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

def _proper_suffixes(word):
    for i in range(1, len(word)):
        yield word[-i:]

def _proper_prefixes(word):
    for i in range(1, len(word)):
        yield word[:i]

########################################
# 1. is_comma_free -------------------- #
########################################

def is_comma_free(code):
    """
    No concatenation of a non-empty suffix of any code-word with a non-empty
    prefix of any code-word may itself be a code-word.
    """
    code_set = set(code)
    for w1 in code:
        for s in _proper_suffixes(w1):
            for w2 in code:
                for p in _proper_prefixes(w2):
                    if s + p in code_set:
                        return False
    return True

########################################
# 2. is_circular ---------------------- #
########################################

def is_circular(code):
    """
    A graph-based uniqueness-of-decomposition test (Fimmel–Michel criterion).
    Build the representing graph G(X) and reject if it contains a directed
    cycle, because a cycle ↔ two distinct circular decompositions.
    """
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

def is_C3(code):
    """
    A code is C³ iff the code itself *and* the two rotation codes obtained by
    shifting every word left by 1 or 2 positions are circular.                  
    """
    if not code:
        return False
    wlen = {len(w) for w in code}
    if len(wlen) != 1:
        return False                     # definition assumes fixed length
    shift1 = {w[1:] + w[:1] for w in code}
    shift2 = {w[2:] + w[:2] for w in code}
    return is_circular(code) and is_circular(shift1) and is_circular(shift2)

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

def analyse_code(code):
    """Return a dict with all five yes/no diagnostics."""
    return dict(
        duplicate_free      = is_duplicate_free(code),
        self_complementary  = is_self_complementary(code),
        comma_free          = is_comma_free(code),
        circular            = is_circular(code),
        C3                  = is_C3(code),
        maximal_self_complementary = is_maximal_self_complementary(code)
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
    analysis = analyse_code(code_list)
    
    # Map to legacy format
    eigenshaften_parameter = {
        "maximal self complementary": analysis['maximal_self_complementary'],  # Not implemented in new version
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
    }
    return eigenshaften_parameter

def properties_alpha_one(number, codon_input):
    """Get properties for alpha-one transformed codons."""
    alpha_input = alph1(codon_input)
    parsed_input = parseinput(number, alpha_input)
    code_list = list(parsed_input)
    analysis = analyse_code(code_list)
    
    properties_parameter1 = {
        "maximal self complementary": analysis['maximal_self_complementary'],  # Not implemented in new version
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
    }
    return properties_parameter1

def properties_alpha_two(number, codon_input):
    """Get properties for alpha-two transformed codons."""
    alpha_input = alph2(codon_input)
    parsed_input = parseinput(number, alpha_input)
    code_list = list(parsed_input)
    analysis = analyse_code(code_list)
    
    properties_parameter2 = {
        "maximal self complementary": analysis['maximal_self_complementary'],  # Not implemented in new version
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
    }
    return properties_parameter2

def properties_alpha_three(number, codon_input):
    """Get properties for alpha-three transformed codons."""
    alpha_input = alph3(codon_input, number)
    parsed_input = parseinput(number, alpha_input)
    code_list = list(parsed_input)
    analysis = analyse_code(code_list)
    
    properties_parameter3 = {
        "maximal self complementary": analysis['maximal_self_complementary'],
        "self complementary": analysis['self_complementary'],
        "circular code": analysis['circular'],
        "comma-free": analysis['comma_free'],
        "duplicate free": analysis['duplicate_free'],
    }
    return properties_parameter3

def c3(number, codon_input):
    """Check C3 properties for codons."""
    parsed_input = last_parse(number, codon_input)
    code_list = [row for row in parsed_input['rows']]
    return is_C3(code_list)
