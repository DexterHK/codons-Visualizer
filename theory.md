
# Codon Visualizer – Research‑Enhanced Specification

Below I fold key findings from the circular‑code literature directly into the “Codon Visualizer” spec you supplied.  
Everything new is tagged **[NEW research]** and backed by the cited papers so that future contributors can trace every design choice.

---

## 1  Backend additions (Python 3 + Flask)

| Layer | Enhancement | Reason |
|-------|-------------|--------|
| **/utils** | **`circularity.py`** – implements the *graph‑acyclicity test* for n‑nucleotide circular codes: a code X is circular **iff** the directed graph G(X) is acyclic, and the length of the longest path equals the window of nucleotides needed to regain frame fileciteturn8file11. | Unifies dinucleotide, trinucleotide and tetranucleotide logic in one routine; replaces the bespoke DFS cycle detector. |
| | **`symmetry.py`** – eight base permutations that commute with complement (`id,c,p,r,πCG,πAT,πACTG,πAGTC`) and form a *D₈* subgroup fileciteturn8file16. | Lets users map any self‑complementary circular code to its 7 symmetric fellows and explore the 27 equivalence classes of C₃ codes fileciteturn8file13. |
| **/services** | **`enumeration_service.py`** – REST endpoint `/api/enumerate?class={cf\|circ\|c3}` returns the complete, pre‑computed catalogue:<br>• 408 maximal comma‑free codes;<br>• 528 maximal self‑complementary circular codes;<br>• 216 maximal self‑complementary C³ codes fileciteturn8file4turn8file5. | Empowers comparative studies without re‑running heavy enumerations. |
| **/api** | Extra query parameter `window=true` on `/analyze` to report the *reading‑frame window* (longest path) for any circular code, reflecting the “13‑nucleotide window” for X₀ fileciteturn8file10. |

## 2  Frontend extensions (React 18 + Reagraph)

### 2.1  New panels

* **Equivalence‑Class Explorer [NEW research]**  
  Visual wheel of the 27 D₈ classes; clicking a class highlights its 8 codes and the transformations that inter‑convert them fileciteturn8file16.

* **Frequency‑Class Heatmap [NEW research]**  
  Displays how often each codon appears across the three maximal families. Frequency classes refine one another in the order *comma‑free → C³ → circular* fileciteturn8file9, helping users trace evolutionary trends.

### 2.2  Graph overlays

* **Window‑Length Annotation [NEW research]**  
  The longest simple path (derived from `enumeration_service`) is over‑plotted as a gradient arc; its length cues users to error‑detection speed fileciteturn8file11.

## 3  Algorithmic upgrades

| Property | Revised algorithm | Complexity |
|----------|-------------------|------------|
| Circularity | Build G(X); return `False` if DFS finds a cycle (≤ 64 nodes); else `True`. Proven equivalent to classic uniqueness‑of‑decomposition test fileciteturn8file11. | **O(n + e)** (linear) |
| C³ check | Run circularity test on X, α₁(X), α₂(X) in sequence; early exit on first failure fileciteturn8file10. | 3 × circularity |
| Self‑complementarity | Verify `←‑c(x) ∈ X` for every x; then optionally apply the eight D₈ permutations to generate its class fileciteturn8file16. | **O(|X|)** |
| Maximality | Ensure |X| = 20 and no two codons lie in the same cyclic‑permutation class fileciteturn8file3. | **O(|X|)** |

All routines remain pure functions returning immutable results, fitting the existing functional pipeline.

## 4  Additional datasets shipped with the tool

* **`data/maximal_codes/{cf,circ,c3}.json`** – machine‑readable lists of the 408, 528, and 216 codes, respectively fileciteturn8file5.  
* **`data/X0_reference.json`** – archetypal maximal self‑complementary C³ code X₀ (the natural code) fileciteturn8file10.

These files load lazily on first request to keep the initial bundle small.

## 5  Research‑driven user stories

1. **Evolutionary reconstruction** – compare a hypothesised primeval code against the enumerated maximal families and visualise the shortest mutation route within its equivalence class.  
2. **Symmetry analysis** – select a circular code, toggle D₈ transformations, and watch the graph morph live, illustrating how biological constraints partition code space.  
3. **Frame‑shift resilience** – inspect the window length for any circular code; a lower value implies faster error‑detection (X₀ has window = 13) fileciteturn8file10.  

## 6  Documentation & help

Each new feature is cross‑linked to the originating paper so that researchers can jump directly from the UI to the methodological source.

*Example*: hovering “Window = 13” reveals “Derived from Fimmel et al. 2016 (Phil. Trans. A)”.  

This tight coupling between code and literature transforms the **Codon Visualizer** from a mere software demo into a **reproducible research companion**.
