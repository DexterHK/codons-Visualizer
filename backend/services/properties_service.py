"""
Service for handling properties-related operations.
"""
from utils.properties_utils import (
    properties, properties_alpha_one, properties_alpha_two, properties_alpha_three,
    c3, is_circular_code
)

class PropertiesService:
    """Service class for properties operations."""
    
    def __init__(self):
        pass
    
    def get_original_properties(self, number_of_codons: int, codons: list) -> dict:
        """Get properties for original codons."""
        return properties(number_of_codons, codons)
    
    def get_alpha_one_properties(self, number_of_codons: int, codons: list) -> dict:
        """Get properties for alpha-one transformed codons."""
        return properties_alpha_one(number_of_codons, codons)
    
    def get_alpha_two_properties(self, number_of_codons: int, codons: list) -> dict:
        """Get properties for alpha-two transformed codons."""
        return properties_alpha_two(number_of_codons, codons)
    
    def get_alpha_three_properties(self, number_of_codons: int, codons: list) -> dict:
        """Get properties for alpha-three transformed codons."""
        return properties_alpha_three(number_of_codons, codons)
    
    def get_c3_properties(self, number_of_codons: int, codons: list):
        """Get C3 properties for codons."""
        return c3(number_of_codons, codons)
    
    def check_circular_code(self, number_of_codons: int, codon_input: list) -> bool:
        """Check if the given codons form a circular code."""
        return is_circular_code(number_of_codons, codon_input)
