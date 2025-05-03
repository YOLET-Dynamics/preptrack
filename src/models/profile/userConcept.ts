import { ConceptMinified } from "../content/concept";

export interface UserConcept {
  concept: ConceptMinified | null;
  recent_eval: string;
  prev_eval: string;
  initial_eval: string;
  avg_time: number;
  questions_attempted: number;
  highest_question_score: number;
  lowest_question_score: number;
}
