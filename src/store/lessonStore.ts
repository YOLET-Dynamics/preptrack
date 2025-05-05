
import { LessonResponse } from "@/models/studyguide/lesson";
import { create } from "zustand";

interface LessonState {
  lessonContent: LessonResponse | null;
  setLessonContent: (content: LessonResponse) => void;
  resetLessonContent: () => void;
}

export const useLessonContentStore = create<LessonState>((set) => ({
  lessonContent: null,
  setLessonContent: (content) => set({ lessonContent: content }),
  resetLessonContent: () => set({ lessonContent: null }),
}));
