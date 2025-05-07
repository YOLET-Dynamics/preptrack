import { HttpResponse } from "@/common/response";
import { LessonResponse } from "@/models/studyguide/lesson";
import {
  StudyGuide,
  StudyGuideSection,
  GenerateSGReq,
} from "@/models/studyguide/studyguide";
import { coreClient } from "@/provider/HttpInterceptor";

export const studyGuideApi = {
  async getStudyGuides(subject: string, completed?: boolean, hidden?: boolean) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<StudyGuide[]>>(
        "/studyguide",
        {
          params: {
            subject,
            completed,
            hidden,
          },
        }
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as StudyGuide[];
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getStudyGuideByID(studyGuideID: string) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<StudyGuide>>(
        `/studyguide/${studyGuideID}`
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as StudyGuide;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getSectionByID(sectionID: string) {
    try {
      const { data: result } = await coreClient.get<
        HttpResponse<StudyGuideSection>
      >(`/studyguide/section/${sectionID}`);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as StudyGuideSection;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async generateStudyGuide(body: GenerateSGReq) {
    try {
      console.log(body);
      const { data: result } = await coreClient.post<
        HttpResponse<{ study_guide_id: string }>
      >("/studyguide", body);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as { study_guide_id: string };
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async getLessonContent(lessonID: string, sectionID: string) {
    try {
      const { data: result } = await coreClient.get<
        HttpResponse<LessonResponse>
      >(`/studyguide/lesson/${lessonID}`, {
        params: {
          section_id: sectionID,
        },
      });

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as LessonResponse;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },

  async changeStudyGuideStatus(studyGuideID: string, hidden: boolean) {
    try {
      const { data: result } = await coreClient.put<HttpResponse<string>>(
        `/studyguide/hidden/${studyGuideID}`,
        null,
        {
          params: {
            hidden,
          },
        }
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as string;
    } catch (error: any) {
      return Promise.reject("An unexpected error occurred");
    }
  },
};
