import { QuestionMinified } from "./question";

export interface ExamMinified {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  subject: string;
  total_questions: number;
}

export interface ExamTopic {
  id: string;
  name: string;
}

export interface ExamConcept {
  id: string;
  name: string;
}

export interface Exam {
  exam_info: ExamMinified;
  concepts: ExamConcept[];
  topics: ExamTopic[];
  questions: QuestionMinified[];
}

export interface ExamProgress {
  currentQuestion: number;
  currentQuestionIndex: number;
  pageNumber: number;
}

export interface UserInteraction {
  selectedAnswer: string | null;
  examDone: boolean;
}
