export interface ExamAttempt {
  question_id: string;
  answer_id: string;
  time_taken: number;
}

export interface ExamEvaluationRequest {
  exam_id: string;
  is_init: boolean;
  attempts: ExamAttempt[];
}

export interface ExamEvaluationResponse {
  exam_score: number;
  correct: number;
  wrong: number;
  skipped: number;
  time_taken: number;
  concept_score: ConceptScore[];
}

export interface ConceptScore {
  concept_id: string;
  concept_name: string;
  score: number;
  count: number;
  focus_area: boolean;
}
