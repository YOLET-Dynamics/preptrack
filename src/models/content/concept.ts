import { PageInfo } from "../common/pageInfo";
import { Subject } from "./subject";
import { Difficulty } from "./difficulty";
import { Topic } from "./topic";

export interface ConceptResponse {
  page_info: PageInfo;
  concepts: Concept[];
}

export interface Concept {
  id: string;
  name: string;
  desc: string;
  difficulty: Difficulty;
  subject: Subject;
  topic: Topic;
  order: number;
}

export interface ConceptMinified {
  id: string;
  name: string;
  difficulty: string;
  subject: string;
  topic: string;
}
