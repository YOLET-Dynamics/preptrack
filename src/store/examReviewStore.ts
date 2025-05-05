import { ExamAnswers } from "@/models/evaluation/examAnswers";
import { create } from "zustand";

interface ExamReviewState {
  reviewData: ExamAnswers | null;
  setReviewData: (data: ExamAnswers) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useExamReviewStore = create<ExamReviewState>((set) => ({
  reviewData: null,
  setReviewData: (data: ExamAnswers | null) => {
    set({ reviewData: data });
  },
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));
