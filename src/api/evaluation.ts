import { HttpResponse } from "@/common/response";
import {
  ExamEvaluationRequest,
  ExamEvaluationResponse,
} from "@/models/evaluation/evaluateExam";
import { ExamAnswers } from "@/models/evaluation/examAnswers";
import { coreClient } from "@/provider/HttpInterceptor";

const DEFAULT_PAGE_SIZE = 8;
const QUICK_PAGE_SIZE = 4;

export const evaluationApi = {
  async evaluateExam(body: ExamEvaluationRequest) {
    try {
      const { data: result } = await coreClient.post<
        HttpResponse<ExamEvaluationResponse>
      >("/evaluation/exam", body);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as ExamEvaluationResponse;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getExamAnswers(examID: string | undefined, pageNumber: number) {
    if (!examID) return Promise.reject("Exam ID is required");
    try {
      const { data: result } = await coreClient.get<HttpResponse<ExamAnswers>>(
        `/evaluation/exam/${examID}`,
        {
          params: {
            page_number: pageNumber,
            page_size: DEFAULT_PAGE_SIZE,
          },
        }
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as ExamAnswers;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },
};
