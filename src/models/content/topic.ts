import { PageInfo } from "../common/pageInfo";
import { Subject, SubjectMinified } from "./subject";

export interface TopicsResponse {
  page_info: PageInfo;
  topics: Topic[];
}

export interface Topic {
  desc: string;
  id: string;
  name: string;
  subject: Subject;
  order: number;
}

export interface TopicMinified {
  desc: string;
  id: string;
  name: string;
  subject: SubjectMinified;
  order: number;
}
