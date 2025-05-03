import { HttpResponse } from "@/common/response";
import { TopicAudit, ConceptAudit } from "@/models/profile/audits";
import { EvaluationResult } from "@/models/profile/examResult";
import { InitExamReq, InitExamResp } from "@/models/profile/initExam";
import { UserConcept } from "@/models/profile/userConcept";
import { UserSubject } from "@/models/profile/userSubject";
import { UserTopic } from "@/models/profile/userTopic";
import { coreClient } from "@/provider/HttpInterceptor";

const DEFAULT_PAGE_SIZE = 8;

export const profileApi = {
  async initExam(body: InitExamReq) {
    try {
      const { data: result } = await coreClient.post<
        HttpResponse<InitExamResp>
      >("/profile/init-exam", body);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as InitExamResp;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getExamEvaluation(body: { examID: string; pageNumber: number }) {
    try {
      const { data: result } = await coreClient.get<
        HttpResponse<EvaluationResult>
      >(`/profile/evaluation/${body.examID}`, {
        params: {
          page_number: body.pageNumber,
          page_size: DEFAULT_PAGE_SIZE,
        },
      });

      if (result.success && !result.success) {
        return Promise.reject(result.data);
      }

      return result.data as EvaluationResult;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },
  async getUserSubjects() {
    try {
      const { data: result } = await coreClient.get<HttpResponse<UserSubject>>(
        "/profile/subject",
        {}
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as UserSubject;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getUserTopics(subjectID: string) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<UserTopic[]>>(
        "/profile/topic",
        {
          params: {
            subject: subjectID,
          },
        }
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as UserTopic[];
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getUserTopicDetail(topicID: string) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<UserTopic>>(
        `/profile/topic/${topicID}`
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as UserTopic;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getUserConcepts(topicID: string) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<UserConcept>>(
        "/profile/concept",
        {
          params: {
            topic: topicID,
          },
        }
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as UserConcept;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getTopicAudits(topicID: string, dateRange?: string) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<TopicAudit[]>>(
        `/profile/audits/topic/${topicID}`,
        {
          params: {
            date_range: dateRange,
          },
        }
      );

      if (result.success && !result.success) {
        return Promise.reject(result.data);
      }

      return result.data as TopicAudit[];
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getConceptAudits(conceptID: string, dateRange?: string) {
    try {
      const { data: result } = await coreClient.get<
        HttpResponse<ConceptAudit[]>
      >(`/profile/audits/concept/${conceptID}`, {
        params: {
          date_range: dateRange,
        },
      });

      if (result.success && !result.success) {
        return Promise.reject(result.data);
      }

      return result.data as ConceptAudit[];
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },
};
