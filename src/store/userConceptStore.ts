import { create } from "zustand";
import { UserConcept } from "@/models/profile/userConcept";

interface UserConceptStore {
  userConcept: UserConcept | null;
  setUserConcept: (data: UserConcept | null) => void;
}

export const useUserConceptStore = create<UserConceptStore>((set) => ({
  userConcept: null,
  setUserConcept: (data: UserConcept | null) => set({ userConcept: data }),
}));
