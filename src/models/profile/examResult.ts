import { ExamConcept, ExamTopic } from "../content/exam";
import { QuestionResult } from "./questionResult";

export interface EvaluationResult {
  id: string;
  exam_title: string;
  total_questions: number;
  topics: ExamTopic[];
  concepts: ExamConcept[];
  exam_score: number;
  attempts: number;
  correct: number;
  wrong: number;
  skipped: number;
  time_taken: number;
  question_results: QuestionResult[];
  page_number: number;
  total_pages: number;
}
