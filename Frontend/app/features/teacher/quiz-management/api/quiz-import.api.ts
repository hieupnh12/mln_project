import { apiClient } from "~/shared/services/api-client";

import {
  QUIZ_EXAM_IMPORT_TIMEOUT_MS,
  QUIZ_MANAGEMENT_ENDPOINTS,
} from "../constants/quiz-management.constants";
import type { BackendApiResponse } from "../types/quiz-management-api.types";
import type { ImportExamAsQuizPayload, ImportExamAsQuizResultDto } from "../types/quiz-import.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  if (response.data.code !== undefined && response.data.code !== 1000) {
    throw new Error(response.data.message ?? "Yêu cầu thất bại");
  }
  if (response.data.result == null) {
    throw new Error(response.data.message ?? "API không trả dữ liệu kết quả");
  }
  return response.data.result;
}

export async function importExamAsQuizApi(payload: ImportExamAsQuizPayload) {
  const response = await apiClient.post<BackendApiResponse<ImportExamAsQuizResultDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.importExam,
    payload,
    { timeout: QUIZ_EXAM_IMPORT_TIMEOUT_MS },
  );
  return unwrap(response);
}
