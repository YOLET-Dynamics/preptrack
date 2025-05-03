export interface ExplanationMinified {
  id: string;
  description: string;
  resource_url: string;
}

export interface AnswerMinified {
  id: string;
  value: string;
  explanation: ExplanationMinified;
}

export interface ResourceMinified {
  id: string;
  question_id: string;
  type: string;
  resource_url: string;
}

export interface QuestionMinified {
  id: string;
  value: string;
  avg_completion_time: number;
  difficulty: string;
  concept: string;
  topic: string;
  answer: AnswerMinified;
  choices: AnswerMinified[];
  resources?: ResourceMinified[];
}
