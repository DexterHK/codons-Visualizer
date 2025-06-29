import { create } from "zustand";

export const useStore = create((set) => ({
  codons: "",
  numOfCodons: 0,
  originalCodons: { nodes: [], edges: [] },
  alphaOne: { nodes: [], edges: [] },
  alphaTwo: { nodes: [], edges: [] },
  alphaThree: { nodes: [], edges: [] },
  eigenschaften: {},
  eigenschaftenAlphaOne: {},
  eigenschaftenAlphaTwo: {},
  eigenschaftenAlphaThree: {},
  error: "",
  c3: false, // Add c3 to the store
  longestPath: {},
  theme: "dark", // Default theme is dark
  setCodons: (codons) => set({ codons }),
  setNumOfCodons: (numOfCodons) => set({ numOfCodons }),
  setOriginalCodons: (originalCodons) => set({ originalCodons }),
  setAlphaOne: (alphaOne) => set({ alphaOne }),
  setAlphaTwo: (alphaTwo) => set({ alphaTwo }),
  setAlphaThree: (alphaThree) => set({ alphaThree }),
  setEigenschaften: (eigenschaften) => set({ eigenschaften }),
  setEigenschaftenAlphaOne: (eigenschaftenAlphaOne) => set({ eigenschaftenAlphaOne }),
  setEigenschaftenAlphaTwo: (eigenschaftenAlphaTwo) => set({ eigenschaftenAlphaTwo }),
  setEigenschaftenAlphaThree: (eigenschaftenAlphaThree) => set({ eigenschaftenAlphaThree }),
  setC3: (c3) => set({ c3 }),
  setLongestPath: (longestPath) => set({ longestPath }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  
  setError: (error) => set({ error }),
}));
