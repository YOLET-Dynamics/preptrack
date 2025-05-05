import { StudyGuide, StudyGuideSection } from "@/models/studyguide/studyguide";
import { create } from "zustand";


interface useStudyGuideStore {
  guide: StudyGuide | null;
  setGuide: (guide: StudyGuide | null) => void;
}

export const useStudyGuideStore = create<useStudyGuideStore>((set) => ({
  guide: null,
  setGuide: (guide) => set({ guide }),
}));

interface useStudyGuideSectionStore {
  section: StudyGuideSection | null;
  setSection: (guide: StudyGuideSection | null) => void;
}

export const useStudyGuideSectionStore = create<useStudyGuideSectionStore>(
  (set) => ({
    section: null,
    setSection: (guide) => set({ section: guide }),
  })
);
