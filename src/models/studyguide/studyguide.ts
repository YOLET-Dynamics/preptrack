import { ExamMinified } from "../content/exam";

export interface Lesson {
  completed: boolean;
  id: string;
  title: string;
}

export interface StudyGuideSection {
  completed: boolean;
  completion: string;
  id: string;
  lessons: Lesson[];
  overview: string;
  title: string;
  topic: string;
  section_exam: ExamMinified;
}

export interface StudyGuide {
  completed: boolean;
  completion: string;
  description: string;
  id: string;
  sections: StudyGuideSection[];
  title: string;
  hidden: boolean;
}

export interface GenerateSGReq {
  subject_id: string;
  topics: string[];
}