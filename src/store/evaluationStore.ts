import { create } from "zustand";
import { EvaluationResult } from "@/models/profile/examResult";

interface EvaluationStore {
  evaluation: EvaluationResult | null;
  setEvaluation: (data: EvaluationResult) => void;
  resetEvaluation: () => void;
}

const useEvaluationStore = create<EvaluationStore>((set) => ({
  evaluation: null,
  setEvaluation: (data: EvaluationResult) => set({ evaluation: data }),
  resetEvaluation: () => set({ evaluation: null }),
}));

export default useEvaluationStore;
