import { create } from "zustand";
import { UserTopic } from "@/models/profile/userTopic";

interface UserTopicStore {
  userTopic: UserTopic | null;
  setUserTopic: (data: UserTopic | null) => void;
}

export const useUserTopicStore = create<UserTopicStore>((set) => ({
  userTopic: null,
  setUserTopic: (data: UserTopic | null) => set({ userTopic: data }),
}));
