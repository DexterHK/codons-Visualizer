"""
Comma-Free Code Analysis
Corrected implementation based on GCAT (Genetic Code Analysis Toolkit)
"""

import logging

# Setup logger
logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)



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
        logger.info("Tuples of variable length, can't check for comma-free.")
        return False
    
    # Check for duplicates first
    if has_duplicates(strings):
        logger.info("Duplicate tuples in sequence, code not comma-free.")
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
                        logger.info(f"Shifted tuple created from '{tupleA}' and '{tupleB}' is contained in sequence, code not comma-free.")
                        return False
    
    return True  # No collision found

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
# Example usage
stringy = "TCATCCTCGTCTACAACC"  # Original example
length =3
result = parseinput(length,stringy)
print("Parsed tuples:", result)
print("Is comma-free:", is_comma_free(result,length))


