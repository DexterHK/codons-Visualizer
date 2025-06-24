"""
Service for handling codon-related operations.
"""
from utils.codon_utils import (
    remove_spaces, remove_backslashes, parseinput, get_complement, 
    complement, is_self_complementary, is_maximal_self_complementary,
    word_length, is_comma_free, is_duplicate_free,
    alph1, alph2, alph3
)
from utils.processing_utils import (
    get_component_graph, get_full_representing_graph, process_codons_1_rest,
    process_codons_2_2, process_codons_rest_1, merge_rows, last_parse
)

class CodonService:
    """Service class for codon operations."""
    
    def __init__(self):
        pass
    
    def process_codon_input(self, codon_length: int, codons: str) -> list:
        """Process and parse codon input."""
        return parseinput(codon_length, codons)
    
    def get_codon_complement(self, sequence: str) -> str:
        """Get complement of a codon sequence."""
        return complement(sequence)
    
    def check_self_complementary(self, codons) -> bool:
        """Check if codons are self-complementary."""
        return is_self_complementary(codons)
    
    def check_maximal_self_complementary(self, codons) -> bool:
        """Check if codons are maximal self-complementary."""
        return is_maximal_self_complementary(codons)
    
    def get_word_length(self, code):
        """Get word length of code."""
        return word_length(code)
    
    def check_comma_free(self,tuple_length, code) -> bool:
        """Check if code is comma-free."""
        return is_comma_free(code,tuple_length)
    
    def check_duplicate_free(self, code) -> bool:
        """Check if code is duplicate-free."""
        return is_duplicate_free(code)
    
    def apply_alpha_transformation(self, sequence: str, alpha_type: int) -> str:
        """Apply alpha transformation to sequence."""
        if alpha_type == 1:
            return alph1(sequence)
        elif alpha_type == 2:
            return alph2(sequence)
        elif alpha_type == 3:
            return alph3(sequence)
        else:
            raise ValueError("Invalid alpha type. Must be 1, 2, or 3.")
    
    
    def get_component_breakdown(self, codons: list, component_index: int) -> dict:
        """Get component graph breakdown using processing_utils."""
        return get_component_graph(codons, component_index)
    
    def get_full_graph_breakdown(self, codons: list) -> dict:
        """Get full representing graph breakdown using processing_utils."""
        return get_full_representing_graph(codons)
    
    def get_1_rest_breakdown(self, codons: list) -> dict:
        """Get 1-rest breakdown using processing_utils."""
        return process_codons_1_rest(codons)
    
    def get_2_2_breakdown(self, codons: list) -> dict:
        """Get 2-2 breakdown using processing_utils."""
        return process_codons_2_2(codons)
    
    def get_rest_1_breakdown(self, codons: list) -> dict:
        """Get rest-1 breakdown using processing_utils."""
        return process_codons_rest_1(codons)
    
    def merge_codon_rows(self, dict1: dict, dict2: dict) -> dict:
        """Merge two dictionaries containing codon rows using processing_utils."""
        return merge_rows(dict1, dict2)
    
    def get_complete_breakdown(self, number_of_codons: int, codons: str) -> dict:
        """Get complete codon breakdown using processing_utils last_parse."""
        return last_parse(number_of_codons, codons)
