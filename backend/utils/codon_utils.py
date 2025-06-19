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

def is_comma_free(code) -> bool:
    """Check if code is comma-free."""
    if not code:
        return False
    L = word_length(code)
    for u in code:
        for v in code:
            for r in range(1, L):
                candidate = u[r:] + v[:r]
                if candidate in code:
                    return False
    return True

def is_duplicate_free(code) -> bool:
    """Check if code is duplicate-free."""
    code_list = list(code)
    return len(code_list) == len(set(code_list))

def shift_string(s: str, shift: int) -> str:
    """Shift string by given amount."""
    if not s:
        return s
    effective_shift = shift % len(s)
    return s[-effective_shift:] + s[:-effective_shift]

def alph1(codons_string: str, codon_length: int = None) -> str:
    """Apply alpha-1 transformation (left shift by 1) to each codon in the string."""
    # Remove spaces and newlines first
    clean_string = remove_spaces(remove_backslashes(codons_string))
    
    # If codon_length not provided, try to determine from string length
    if codon_length is None:
        if len(clean_string) % 2 == 0:
            codon_length = 2
        elif len(clean_string) % 3 == 0:
            codon_length = 3
        elif len(clean_string) % 4 == 0:
            codon_length = 4
        else:
            codon_length = 3  # Default fallback
    
    result = ""
    for i in range(0, len(clean_string), codon_length):
        codon = clean_string[i:i + codon_length]
        if len(codon) == codon_length:
            # Left shift by 1: first character goes to end
            shifted_codon = codon[1:] + codon[0]
            result += shifted_codon
        else:
            result += codon  # If incomplete codon, keep as is
    
    return result

def alph2(codons_string: str, codon_length: int = None) -> str:
    """Apply alpha-2 transformation (left shift by 2) to each codon in the string."""
    # Remove spaces and newlines first
    clean_string = remove_spaces(remove_backslashes(codons_string))
    
    # If codon_length not provided, try to determine from string length
    if codon_length is None:
        if len(clean_string) % 2 == 0:
            codon_length = 2
        elif len(clean_string) % 3 == 0:
            codon_length = 3
        elif len(clean_string) % 4 == 0:
            codon_length = 4
        else:
            codon_length = 3  # Default fallback
    
    result = ""
    for i in range(0, len(clean_string), codon_length):
        codon = clean_string[i:i + codon_length]
        if len(codon) == codon_length:
            # Left shift by 2: first two characters go to end
            shift_amount = 2 % codon_length  # Handle cases where codon_length < 2
            shifted_codon = codon[shift_amount:] + codon[:shift_amount]
            result += shifted_codon
        else:
            result += codon  # If incomplete codon, keep as is
    
    return result

def alph3(codons_string: str, codon_length: int = None) -> str:
    """Apply alpha-3 transformation (left shift by 3) to each codon in the string."""
    # Remove spaces and newlines first
    clean_string = remove_spaces(remove_backslashes(codons_string))
    
    # If codon_length not provided, try to determine from string length
    if codon_length is None:
        if len(clean_string) % 4 == 0:
            codon_length = 4
        else:
            # If not divisible by 4, return original string
            return codons_string
    
    # Alpha-3 is typically only meaningful for length 4 codons
    if codon_length != 4:
        return codons_string
    
    result = ""
    for i in range(0, len(clean_string), codon_length):
        codon = clean_string[i:i + codon_length]
        if len(codon) == codon_length:
            # Left shift by 3: first three characters go to end
            shifted_codon = codon[3:] + codon[:3]
            result += shifted_codon
        else:
            result += codon  # If incomplete codon, keep as is
    
    return result
