"""
Utility functions for properties operations.
"""
from .codon_utils import parseinput, is_self_complementary, is_maximal_self_complementary, is_comma_free, is_duplicate_free, alph1, alph2
from .processing_utils import last_parse
from .graph_utils import all_cycles

def is_circular_code(number, codon_input):
    """Check if the given codons form a circular code."""
    codons = last_parse(number, codon_input)
    return len(all_cycles(codons['rows'])) <= 0

def properties(number, codon_input):
    """Get properties for original codons."""
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
    """Get properties for alpha-one transformed codons."""
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
    """Get properties for alpha-two transformed codons."""
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

def c3(number, codon_input):
    """Check C3 properties for codons."""
    parsed_input = last_parse(number, codon_input)
    alpha_one = alph1(codon_input)
    alpha_two = alph2(codon_input)
    parsed_input_alpha_one = last_parse(number, alpha_one)
    parsed_input_alpha_two = last_parse(number, alpha_two)
    if (
        len(all_cycles(parsed_input['rows'])) <= 0 and 
        len(all_cycles(parsed_input_alpha_one['rows'])) <= 0 
        and len(all_cycles(parsed_input_alpha_two['rows'])) <= 0 
    ):
        return True
    else:
        return False
