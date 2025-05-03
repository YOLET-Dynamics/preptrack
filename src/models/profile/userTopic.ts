import { TopicMinified } from "../content/topic";
import { UserConcept } from "./userConcept";

export interface UserTopic {
  topic: TopicMinified;
  concept_evals: UserConcept[] | null;
  recent_eval: string;
  prev_eval: string;
  initial_eval: string;
  concepts_attempted: number;
  total_concepts: number;
  questions_attempted: number;
  highest_question_score: number;
  lowest_question_score: number;
}
