import { create } from "zustand";
import { TestPath } from "@/models/testPath";

interface useTestPathStore {
  testPath: TestPath | null;
  setTestPath: (guide: TestPath | null) => void;
}

export const useTestPathStore = create<useTestPathStore>((set) => ({
  testPath: null,
  setTestPath: (testPath) => set({ testPath }),
}));
