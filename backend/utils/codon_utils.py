import re

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
    if codon_length < 1:
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
    alpha1 = alph1(code,tuple_length)
    alpha2 = alph2(code,tuple_length)
    alpha3 = alph3(code,tuple_length)
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



# --------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------
def _clean(text: str) -> str:
    """Remove whitespace and back-slashes; force upper-case."""
    return re.sub(r'[\s\\]+', '', text.upper())

def _split(text: str, size: int) -> list[str]:
    if len(text) % size != 0:
        raise ValueError(
            f"Input length {len(text)} is not a multiple of codon_length={size}"
        )
    return [text[i:i + size] for i in range(0, len(text), size)]

# --------------------------------------------------------------------
# core transform
# --------------------------------------------------------------------
def alpha(codons_string: str,
          k: int,
          codon_length: int) -> str:
    """
    Right-rotate every *codon_length*-letter word by *k* positions.
    If a tail shorter than *codon_length* remains:
        • rotate it when tail_len > k
        • otherwise leave the tail unchanged (no error).
    The result is one continuous string, no spaces.
    """
    if not (1 <= k < codon_length):
        raise ValueError("k must satisfy 1 ≤ k < codon_length")

    clean    = _clean(codons_string)
    full_len = len(clean) // codon_length * codon_length
    tail_len = len(clean) - full_len

    # ------ rotate the full codons ------
    codon_part = clean[:full_len]
    codons     = _split(codon_part, codon_length)
    rotated    = [c[-k:] + c[:-k] for c in codons]

    # ------ handle the tail ------
    if tail_len:
        tail = clean[full_len:]
        if tail_len > k:
            tail = tail[-k:] + tail[:-k]     # rotate only when possible
        # otherwise: keep tail as-is
        rotated.append(tail)

    return ''.join(rotated)
# --------------------------------------------------------------------
# convenience wrappers
# --------------------------------------------------------------------
def alph1(codons_string: str,
           codon_length: int ) -> str:
    """Right-shift by 1 (α₁)."""
    x = alpha(codons_string, 1, codon_length)
    return x


def alph2(codons_string: str,
           codon_length: int) -> str:
    """Right-shift by 2 (α₂)."""
    x = alpha(codons_string, 2, codon_length)
    return x

def alph3(codons_string: str,
           codon_length: int) -> str:
    """
    Right-shift by 3 (α₃).  
    Meaningful only when *codon_length* = 4.
    """
    x = alpha(codons_string, 3, codon_length)
    return x
