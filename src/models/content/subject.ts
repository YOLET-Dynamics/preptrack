import { PageInfo } from "../common/pageInfo";

export interface Subject {
  desc: string;
  id: string;
  name: string;
  is_international: boolean;
  intl_level: number;
  resource_url: string;
}

export interface SubjectMinified {
  desc: string;
  id: string;
  name: string;
}

export interface SubjectResponse {
  page_info: PageInfo;
  subjects: Subject[];
}
