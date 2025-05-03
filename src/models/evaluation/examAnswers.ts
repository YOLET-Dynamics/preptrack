import { QuestionResult } from "../profile/questionResult";

export interface ExamAnswers {
  page_number: number;
  total_pages: number;
  question_results: QuestionResult[];
}
