import { TopicConcept } from "../common/topicConcept";

export interface InitExamReq {
  subject_id: string;
  content: TopicConcept[];
}

export interface InitExamResp {
  exam_id: string;
}
