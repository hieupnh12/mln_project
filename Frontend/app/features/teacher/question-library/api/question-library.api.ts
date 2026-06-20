import { apiClient } from "~/shared/services/api-client";

import { ApiRequestError } from "~/shared/services/api-client";

import {
  QUESTION_BATCH_IMPORT_TIMEOUT_MS,
  QUESTION_LIBRARY_ENDPOINTS,
} from "../constants/question-library.constants";
import type {
  BackendApiResponse,
  BatchImportPayload,
  BatchImportReportDto,
  BulkApproveQuestionsPayload,
  BulkApproveQuestionsReportDto,
  CheckDuplicatePayload,
  CreateQuestionPayload,
  DuplicateCheckDto,
  QuestionDto,
  QuestionListDto,
  QuestionMetadataDto,
  QuestionStatsDto,
} from "../types/question-library-api.types";
import type { QuestionFilters } from "../types/question-library.types";

const API_SUCCESS_CODE = 1000;

function unwrap<T>(response: { data: BackendApiResponse<T>; status?: number }): T {
  const payload = response.data;

  if (payload.code !== undefined && payload.code !== API_SUCCESS_CODE) {
    throw new ApiRequestError({
      message: payload.message ?? "Không thể xử lý phản hồi từ API.",
      code: String(payload.code),
      status: response.status,
    });
  }

  if (payload.result == null) {
    throw new ApiRequestError({
      message: payload.message ?? "API không trả về dữ liệu kết quả.",
      code: payload.code != null ? String(payload.code) : undefined,
      status: response.status,
    });
  }

  return payload.result;
}

export async function fetchQuestionMetadata() {
  const response = await apiClient.get<BackendApiResponse<QuestionMetadataDto>>(
    QUESTION_LIBRARY_ENDPOINTS.metadata,
  );
  return unwrap(response);
}

export async function fetchQuestions(filters: QuestionFilters, page: number, size: number) {
  const response = await apiClient.get<BackendApiResponse<QuestionListDto>>(
    QUESTION_LIBRARY_ENDPOINTS.questions,
    {
      params: {
        search: filters.search || undefined,
        course: filters.course,
        chapter: filters.chapter,
        lesson: filters.lesson,
        difficulty: filters.difficulty,
        type: filters.type,
        status: filters.status,
        page,
        size,
      },
    },
  );
  return unwrap(response);
}

export async function fetchQuestion(id: string) {
  const numericId = id.startsWith("Q-") ? id.slice(2) : id;
  const response = await apiClient.get<BackendApiResponse<QuestionDto>>(
    QUESTION_LIBRARY_ENDPOINTS.questionById(numericId),
  );
  return unwrap(response);
}

export async function fetchQuestionStats() {
  const response = await apiClient.get<BackendApiResponse<QuestionStatsDto>>(
    QUESTION_LIBRARY_ENDPOINTS.stats,
  );
  return unwrap(response);
}

export async function checkDuplicateApi(payload: CheckDuplicatePayload) {
  const response = await apiClient.post<BackendApiResponse<DuplicateCheckDto>>(
    QUESTION_LIBRARY_ENDPOINTS.checkDuplicate,
    payload,
  );
  return unwrap(response);
}

export async function createQuestionApi(payload: CreateQuestionPayload) {
  const response = await apiClient.post<BackendApiResponse<QuestionDto>>(
    QUESTION_LIBRARY_ENDPOINTS.questions,
    payload,
  );
  return unwrap(response);
}

export async function updateQuestionApi(id: string, payload: CreateQuestionPayload) {
  const numericId = id.startsWith("Q-") ? id.slice(2) : id;
  const response = await apiClient.put<BackendApiResponse<QuestionDto>>(
    QUESTION_LIBRARY_ENDPOINTS.questionById(numericId),
    payload,
  );
  return unwrap(response);
}

export async function batchImportQuestionsApi(payload: BatchImportPayload) {
  const response = await apiClient.post<BackendApiResponse<BatchImportReportDto>>(
    QUESTION_LIBRARY_ENDPOINTS.batchImport,
    payload,
    { timeout: QUESTION_BATCH_IMPORT_TIMEOUT_MS },
  );
  return unwrap(response);
}

export async function approveQuestionApi(id: string) {
  const numericId = id.startsWith("Q-") ? id.slice(2) : id;
  const response = await apiClient.post<BackendApiResponse<QuestionDto>>(
    QUESTION_LIBRARY_ENDPOINTS.approveQuestion(numericId),
  );
  return unwrap(response);
}

export async function bulkApproveQuestionsApi(payload: BulkApproveQuestionsPayload) {
  const response = await apiClient.post<BackendApiResponse<BulkApproveQuestionsReportDto>>(
    QUESTION_LIBRARY_ENDPOINTS.bulkApprove,
    payload,
  );
  return unwrap(response);
}

export async function deleteQuestionApi(id: string) {
  const numericId = id.startsWith("Q-") ? id.slice(2) : id;
  await apiClient.delete(QUESTION_LIBRARY_ENDPOINTS.questionById(numericId));
}

export async function deleteQuestionsApi(ids: string[]) {
  await apiClient.delete(QUESTION_LIBRARY_ENDPOINTS.questions, {
    params: { ids: ids.map((id) => (id.startsWith("Q-") ? id.slice(2) : id)).join(",") },
  });
}
