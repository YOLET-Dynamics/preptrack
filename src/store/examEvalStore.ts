import { ExamEvaluationResponse } from "@/models/evaluation/evaluateExam";
import { create } from "zustand";

interface ExamEvaluationStore {
  examEvaluation: ExamEvaluationResponse | null;
  setExamEvaluation: (data: ExamEvaluationResponse) => void;
  resetExamEvaluation: () => void;
}

const useExamEvaluationStore = create<ExamEvaluationStore>((set) => ({
  examEvaluation: null,
  setExamEvaluation: (data) => set({ examEvaluation: data }),
  resetExamEvaluation: () => set({ examEvaluation: null }),
}));

export default useExamEvaluationStore;
