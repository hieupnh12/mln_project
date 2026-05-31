import { apiClient } from "~/shared/services/api-client";

import { QUESTION_LIBRARY_ENDPOINTS } from "../constants/question-library.constants";
import type {
  BackendApiResponse,
  BatchImportPayload,
  BatchImportReportDto,
  CheckDuplicatePayload,
  CreateQuestionPayload,
  DuplicateCheckDto,
  QuestionDto,
  QuestionListDto,
  QuestionMetadataDto,
  QuestionStatsDto,
} from "../types/question-library-api.types";
import type { QuestionFilters } from "../types/question-library.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function fetchQuestionMetadata() {
  const response = await apiClient.get<BackendApiResponse<QuestionMetadataDto>>(
    QUESTION_LIBRARY_ENDPOINTS.metadata,
  );
  return unwrap(response);
}

export async function fetchQuestions(filters: QuestionFilters, page = 0, size = 1000) {
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

export async function batchImportQuestionsApi(payload: BatchImportPayload) {
  const response = await apiClient.post<BackendApiResponse<BatchImportReportDto>>(
    QUESTION_LIBRARY_ENDPOINTS.batchImport,
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
