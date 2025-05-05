import { coreClient } from "@/provider/HttpInterceptor";
import { PaginationRes } from "../models/common/pageInfo";
import { Concept } from "../models/content/concept";
import { Exam } from "../models/content/exam";
import { Subject } from "../models/content/subject";
import { Topic } from "../models/content/topic";
import { HttpResponse } from "@/common/response";
import { LessonResponse } from "@/models/studyguide/lesson";

const DEFAULT_PAGE_SIZE = 6;
const TOPIC_PAGE_SIZE = 5;
const QUESTION_PAGE_SIZE = 5;

export const contentApi = {
  async getSubject(pageNumber: number) {
    try {
      const params: {
        page_number: number;
        page_size: number;
        is_international?: boolean;
        grade?: number;
      } = {
        page_number: pageNumber,
        page_size: DEFAULT_PAGE_SIZE,
      };

      const { data: result } = await coreClient.get<
        HttpResponse<PaginationRes<Subject>>
      >("/content/subjects", {
        params,
      });

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as PaginationRes<Subject>;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getTopics(subjectID: string, pageNumber: number) {
    try {
      const { data: result } = await coreClient.get<
        HttpResponse<PaginationRes<Topic>>
      >("/content/topics", {
        params: {
          subject_id: subjectID,
          page_number: pageNumber,
          page_size: TOPIC_PAGE_SIZE,
        },
      });

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as PaginationRes<Topic>;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getConcepts(topicID: string, pageNumber: number) {
    try {
      const { data: result } = await coreClient.get<
        HttpResponse<PaginationRes<Concept>>
      >("/content/concepts", {
        params: {
          topic_id: topicID,
          page_number: pageNumber,
          page_size: DEFAULT_PAGE_SIZE,
        },
      });

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as PaginationRes<Concept>;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getExamData(examID: string, pageNumber: number) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<Exam>>(
        `/content/exam/${examID}`,
        {
          params: {
            page_number: pageNumber,
            page_size: QUESTION_PAGE_SIZE,
          },
        }
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as Exam;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getLesson(lessonID: string) {
    try {
      const { data: result } = await coreClient.get<
        HttpResponse<LessonResponse>
      >(`/content/lesson/${lessonID}`);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as LessonResponse;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },
};
