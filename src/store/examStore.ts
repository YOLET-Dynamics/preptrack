import { create } from "zustand";
import { Exam, ExamMinified } from "@/models/content/exam";
import { ExamAttempt } from "@/models/evaluation/evaluateExam";

interface ExamIdState {
  examId: string | null;
  setExamId: (id: string) => void;
  resetExamId: () => void;
}

export const useExamIdStore = create<ExamIdState>((set) => ({
  examId: null,
  setExamId: (id: string) => set({ examId: id }),
  resetExamId: () => set({ examId: null }),
}));

interface ExamState {
  examData: Exam | null;
  isLoading: boolean;
  setExamData: (data: Exam) => void;
  setIsLoading: (loading: boolean) => void;
  resetExamData: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  examData: null,
  isLoading: false,
  setExamData: (data: Exam) => set({ examData: data }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  resetExamData: () => set({ examData: null, isLoading: false }),
}));

interface ExamMiniState {
  examData: ExamMinified | null;
  setExamData: (data: ExamMinified) => void;
  resetExamData: () => void;
}

export const useExamMiniStore = create<ExamMiniState>((set) => ({
  examData: null,
  setExamData: (data: ExamMinified) => set({ examData: data }),
  resetExamData: () => set({ examData: null }),
}));

interface ExamAttemptState {
  responses: ExamAttempt[];
  addResponse: (response: ExamAttempt) => void;
  resetResponses: () => void;
}

export const useExamAttemptStore = create<ExamAttemptState>((set) => ({
  responses: [],
  addResponse: (response) =>
    set((state) => {
      const newResponses = [...state.responses];
      const index = newResponses.findIndex(
        (r) => r.question_id === response.question_id
      );

      if (index !== -1) {
        newResponses[index] = response;
      } else {
        newResponses.push(response);
      }

      return { responses: newResponses };
    }),
  resetResponses: () => set({ responses: [] }),
}));

interface ExamTypeIDStore {
  isInit: boolean;
  setIsInit: (flag: boolean) => void;
}

export const useExamInitStore = create<ExamTypeIDStore>((set) => ({
  isInit: false,
  setIsInit: (flag: boolean) => set({ isInit: flag }),
}));
