import { TopicConcept } from "./common/topicConcept";
import { ExamMinified } from "./content/exam";

export interface TestPath {
  id: string;
  title: string;
  completion: string;
  completed: boolean;
  upgraded: boolean;
  hidden: boolean;
  sections: TestPathSection[];
  created_at: string;
}

export interface TestPathSection {
  id: string;
  title: string;
  topic: string;
  completion: string;
  completed: boolean;
  exams: ExamMinified[];
}

export interface GenerateReq {
  subject_id: string;
  content: TopicConcept[];
  name?: string;
}

export interface GenerateTestPathRes {
  test_path_id: string;
}

export interface UpgradeTestPathReq {
  test_path_id: string;
}
