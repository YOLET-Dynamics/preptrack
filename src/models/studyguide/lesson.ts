import { ExamMinified } from "../content/exam";

export interface LessonResponse {
  id: string;
  title: string;
  content: string;
  order: number;
  topic: string;
  concept: string;
  exam: ExamMinified;
  resources?: LessonResource[];
}

export interface LessonResource {
  id: string;
  lesson_id: string;
  resource_url: string;
  type: string;
}
