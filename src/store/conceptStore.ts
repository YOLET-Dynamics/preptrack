import { Concept } from "@/models/content/concept";
import { create } from "zustand";

interface ConceptStore {
  concepts: Concept[];
  selectedConcepts: Concept[];
  setConcepts: (concepts: Concept[]) => void;
  addConcept: (concept: Concept) => void;
  removeConcept: (conceptId: string) => void;
  clearConcepts: () => void;
  clearSelectedConcepts: () => void;
}

export const useConceptStore = create<ConceptStore>((set) => ({
  concepts: [],
  selectedConcepts: [],
  setConcepts: (concepts) => set({ concepts }),
  addConcept: (concept) =>
    set((state) => ({
      selectedConcepts: [...state.selectedConcepts, concept],
    })),
  removeConcept: (conceptId) =>
    set((state) => ({
      selectedConcepts: state.selectedConcepts.filter(
        (c) => c.id !== conceptId
      ),
    })),
  clearConcepts: () => set({ concepts: [], selectedConcepts: [] }),
  clearSelectedConcepts: () => set({ selectedConcepts: [] }),
}));
