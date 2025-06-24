"""
Utility functions for codon operations.
"""

def remove_spaces(s: str) -> str:
    """Remove spaces from string."""
    return s.replace(" ", "")

def remove_backslashes(s: str) -> str:
    """Remove backslashes from string."""
    return s.replace("\n", "")

def parseinput(codon_length: int, codons: str) -> list:
    """Parse input codons string into list."""
    if codon_length > 4 or codon_length < 1:
        return []
    codonsy = remove_spaces(codons)
    codonsy = remove_backslashes(codonsy)
    return [codonsy[i : i + codon_length] for i in range(0, len(codonsy), codon_length)]

def get_complement(nucleotide: str) -> str:
    """Get complement of a single nucleotide."""
    mapping = {"A": "T", "T": "A", "C": "G", "G": "C"}
    nucleotide = nucleotide.upper()
    try:
        return mapping[nucleotide]
    except KeyError:
        raise ValueError(f"Invalid nucleotide: {nucleotide}")

def complement(sequence: str) -> str:
    """Get complement of a DNA sequence."""
    return "".join(get_complement(nuc) for nuc in sequence)

def is_self_complementary(codons) -> bool:
    """Check if codons are self-complementary."""
    return all(complement(codon) in codons for codon in codons)

def is_maximal_self_complementary(codons) -> bool:
    """Check if codons are maximal self-complementary."""
    return len(codons) == 20 and is_self_complementary(codons)

def word_length(code):
    """Get word length of code."""
    for word in code:
        return len(word)
    return 0

def is_comma_free(code,tuple_length: int) -> bool:
    """
    Checks if a code is comma-free. A code is comma-free if no concatenation of two words contains a
    word from the code as a substring, except where one word is a prefix and the other is a suffix.
    """
    alpha1 = alph1(code)
    alpha2 = alph2(code)
    alpha3 = alph3(code)
    code_chunks = [code[i:i+tuple_length] for i in range(0, len(code), tuple_length)]
    alpha1_chunks = [alpha1[i:i+tuple_length] for i in range(0, len(alpha1), tuple_length)]
    alpha2_chunks = [alpha2[i:i+tuple_length] for i in range(0, len(alpha2), tuple_length)] if alpha2 else []
    alpha3_chunks = [alpha3[i:i+tuple_length] for i in range(0, len(alpha3), tuple_length)] if alpha3 else []
    for chunk in code_chunks:
        if tuple_length == 2:
            if chunk not in alpha1:
                return False
        elif tuple_length == 3:
            if chunk not in (alpha1_chunks + alpha2_chunks):
                return False
        elif tuple_length == 4:
            if chunk not in (alpha1_chunks + alpha2_chunks + alpha3_chunks):
                return False
    
    return True

def is_duplicate_free(code) -> bool:
    """Check if code is duplicate-free."""
    code_list = list(code)
    return len(code_list) == len(set(code_list))



def alph1(codons_string: str, codon_length: int = None) -> str:
    """Apply alpha-1 transformation (right shift by 1) to the string."""
    # Remove spaces and newlines first
    clean_string = remove_spaces(remove_backslashes(codons_string))
    return clean_string[-1:] + clean_string[:-1]  # Right shift by 1


def alph2(codons_string: str, codon_length: int = None) -> str:
    """Apply alpha-2 transformation (right shift by 2) to the string."""
    # Remove spaces and newlines first
    clean_string = remove_spaces(remove_backslashes(codons_string))
    return clean_string[-2:] + clean_string[:-2]  # Right shift by 2


def alph3(codons_string: str, codon_length: int = None) -> str:
    """Apply alpha-3 transformation (right shift by 3) to the string."""
    # Remove spaces and newlines first
    clean_string = remove_spaces(remove_backslashes(codons_string))
    return clean_string[-3:] + clean_string[:-3]  # Right shift by 3
