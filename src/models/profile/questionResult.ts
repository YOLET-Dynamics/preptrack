import { AnswerMinified, QuestionMinified } from "../content/question";

export interface QuestionResult {
  question: QuestionMinified;
  last_attempt: AnswerMinified;
  score: number;
  prev_score: number;
  time_taken: number;
}
