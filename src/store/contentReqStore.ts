import { create } from "zustand";
import { TopicConcept } from "@/models/common/topicConcept";

interface ContentReqStore {
  content: TopicConcept[];
  studyGuideContent: string[];
  addContent: (newContent: TopicConcept) => void;
  addStudyGuideContent: (newStudyGuideContent: string) => void;
  resetContent: () => void;
  resetStudyGuideContent: () => void;
}

export const useContentReqStore = create<ContentReqStore>((set) => ({
  content: [],
  studyGuideContent: [],
  addContent: (newContent) =>
    set((state) => {
      const existingTopic = state.content.find(
        (item) => item.topic_id === newContent.topic_id
      );

      if (existingTopic) {
        const updatedConceptIds = Array.from(
          new Set([...existingTopic.concept_id, ...newContent.concept_id])
        );

        return {
          content: state.content.map((item) =>
            item.topic_id === newContent.topic_id
              ? { ...item, concept_id: updatedConceptIds }
              : item
          ),
        };
      } else {
        return { content: [...state.content, newContent] };
      }
    }),
  addStudyGuideContent: (newStudyGuideContent) =>
    set((state) => ({
      studyGuideContent: Array.from(
        new Set([...state.studyGuideContent, newStudyGuideContent])
      ),
    })),
  resetContent: () => set({ content: [] }),
  resetStudyGuideContent: () => set({ studyGuideContent: [] }),
}));
