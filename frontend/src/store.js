import { create } from "zustand";

export const useStore = create((set) => ({
  codons: "",
  numOfCodons: 0,
  originalCodons: {},
  alphaOne: {},
  alphaTwo: {},
  eigenschaften: {},
  error: "",
  c3: false, // Add c3 to the store
  longestPath: {},
  setCodons: (codons) => set({ codons }),
  setNumOfCodons: (numOfCodons) => set({ numOfCodons }),
  setOriginalCodons: (originalCodons) => set({ originalCodons }),
  setAlphaOne: (alphaOne) => set({ alphaOne }),
  setAlphaTwo: (alphaTwo) => set({ alphaTwo }),
  setEigenschaften: (eigenschaften) => set({ eigenschaften }),
  setEigenschaftenAlphaOne: (eigenschaftenAlphaOne) => set({ eigenschaftenAlphaOne }),
  setEigenschaftenAlphaTwo: (eigenschaftenAlphaTwo) => set({ eigenschaftenAlphaTwo }),
  setC3: (c3) => set({ c3 }),
  setLongestPath: (longestPath) => set({ longestPath }),
  
  setError: (error) => set({ error }),
}));
