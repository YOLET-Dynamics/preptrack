import {
  GenerateReq,
  GenerateTestPathRes,
  UpgradeTestPathReq,
  TestPath,
} from "@/models/testPath";

import { HttpResponse } from "@/common/response";
import { coreClient } from "@/provider/HttpInterceptor";

export const testPathApi = {
  async getTestPaths(subject: string, completed?: boolean, hidden?: boolean) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<TestPath[]>>(
        "/testpath",
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

      return result.data as TestPath[];
    } catch (error: any) {
      return Promise.reject(
        error.response.data || "An unexpected error occurred"
      );
    }
  },

  async getTestPathByID(testPathID: string) {
    try {
      const { data: result } = await coreClient.get<HttpResponse<TestPath>>(
        `/testpath/${testPathID}`,
        {}
      );

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as TestPath;
    } catch (error: any) {
      return Promise.reject(
        error.response.data || "An unexpected error occurred"
      );
    }
  },

  async generateTestPath(body: GenerateReq) {
    try {
      const { data: result } = await coreClient.post<
        HttpResponse<GenerateTestPathRes>
      >(`/testpath`, body);

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as GenerateTestPathRes;
    } catch (error: any) {
      return Promise.reject(
        error.response.data || "An unexpected error occurred"
      );
    }
  },

  async upgradeTestPath(body: UpgradeTestPathReq) {
    try {
      const { data: result } = await coreClient.post<
        HttpResponse<GenerateTestPathRes>
      >(`/testpath/upgrade`, null, {
        params: {
          path_id: body.test_path_id,
        },
      });

      if (!result.success) {
        return Promise.reject(result.data);
      }

      return result.data as GenerateTestPathRes;
    } catch (error: any) {
      return Promise.reject(
        error.response.data || "An unexpected error occurred"
      );
    }
  },

  async changeTestPathStatus(testPathID: string, hidden: boolean) {
    try {
      const { data: result } = await coreClient.put<HttpResponse<string>>(
        `/testpath/hidden/${testPathID}`,
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
      return Promise.reject(
        error.response.data || "An unexpected error occurred"
      );
    }
  },
};
