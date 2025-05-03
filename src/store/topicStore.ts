import { Topic } from "@/models/content/topic";
import { create } from "zustand";

interface TopicStore {
  selectedTopics: Topic[];
  addTopic: (topic: Topic) => void;
  removeTopic: (topicId: string) => void;
  clearTopics: () => void;
  clearSelectedTopics: () => void;
  setSelectedTopics: (topics: Topic[]) => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  selectedTopics: [],
  addTopic: (topic) =>
    set((state) => ({
      selectedTopics: [...state.selectedTopics, topic],
    })),
  removeTopic: (topicId) =>
    set((state) => ({
      selectedTopics: state.selectedTopics.filter((t) => t.id !== topicId),
    })),
  clearTopics: () => set({ selectedTopics: [] }),
  clearSelectedTopics: () => set({ selectedTopics: [] }),
  setSelectedTopics: (topics) => set({ selectedTopics: topics }),
}));
