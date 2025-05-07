import { Subject, SubjectMinified } from "@/models/content/subject";
import { create } from "zustand";

interface SubjectStore {
  subject: Subject | SubjectMinified | undefined;
  setSubject: (subject: Subject | SubjectMinified) => void;
  clearSubject: () => void;
}

const useSubjectStore = create<SubjectStore>((set) => ({
  subject: undefined,
  setSubject: (subject: Subject | SubjectMinified) => set({ subject }),
  clearSubject: () => set({ subject: undefined }),
}));

export default useSubjectStore;
