import { create } from "zustand";
import { SubjectMinified } from "../models/content/subject";

interface SingleSubjectStore {
  userSubject: SubjectMinified | null;
  setUserSubject: (data: SubjectMinified | null) => void;
}

export const useUserSubjectStore = create<SingleSubjectStore>((set) => ({
  userSubject: null,
  setUserSubject: (data: SubjectMinified | null) => set({ userSubject: data }),
}));
