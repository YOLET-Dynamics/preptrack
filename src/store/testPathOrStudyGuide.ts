import { create } from "zustand";

interface TestOrStudyGuideState {
  testorStudyGuide: "tp" | "sg" | null;
  setTestorStudyGuide: (testOrSub: "tp" | "sg") => void;
  resetTestorStudyGuide: () => void;
}

export const useTestorStudyGuide = create<TestOrStudyGuideState>((set) => ({
  testorStudyGuide: null,
  setTestorStudyGuide: (testOrSub) => set({ testorStudyGuide: testOrSub }),
  resetTestorStudyGuide: () => set({ testorStudyGuide: null }),
}));
