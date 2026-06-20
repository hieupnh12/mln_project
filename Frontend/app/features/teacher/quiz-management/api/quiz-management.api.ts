import { apiClient } from "~/shared/services/api-client";

import {
  QUIZ_MANAGEMENT_ENDPOINTS,
  QUIZ_DETAIL_TIMEOUT_MS,
  QUIZ_SAVE_TIMEOUT_MS,
} from "../constants/quiz-management.constants";
import type {
  BackendApiResponse,
  CandidateQuestionListDto,
  QuizDetailDto,
  QuizListDto,
  QuizStatsDto,
  SaveQuizPayload,
} from "../types/quiz-management-api.types";
import type { QuizFilters } from "../types/quiz-management.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function fetchQuizList(filters: QuizFilters, page = 0, size = 50) {
  const response = await apiClient.get<BackendApiResponse<QuizListDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.root,
    {
      params: {
        search: filters.search || undefined,
        course: filters.course,
        status: filters.status,
        page,
        size,
      },
    },
  );
  return unwrap(response);
}

export async function fetchQuizStats() {
  const response = await apiClient.get<BackendApiResponse<QuizStatsDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.stats,
  );
  return unwrap(response);
}

export async function fetchQuizDetail(id: string) {
  const response = await apiClient.get<BackendApiResponse<QuizDetailDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.byId(id),
    { timeout: QUIZ_DETAIL_TIMEOUT_MS },
  );
  return unwrap(response);
}

export async function fetchCandidateQuestions(params: {
  course: string;
  chapter: string;
  lesson: string;
  search: string;
  difficulty: string;
  page: number;
  size: number;
}) {
  const response = await apiClient.get<BackendApiResponse<CandidateQuestionListDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.candidateQuestions,
    {
      params: {
        search: params.search || undefined,
        course: params.course,
        chapter: params.chapter,
        lesson: params.lesson,
        difficulty: params.difficulty === "all" ? "all" : params.difficulty,
        page: params.page,
        size: params.size,
      },
    },
  );
  return unwrap(response);
}

export async function createQuizApi(payload: SaveQuizPayload) {
  const response = await apiClient.post<BackendApiResponse<QuizDetailDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.root,
    payload,
    { timeout: QUIZ_SAVE_TIMEOUT_MS },
  );
  return unwrap(response);
}

export async function updateQuizApi(id: string, payload: SaveQuizPayload) {
  const response = await apiClient.put<BackendApiResponse<QuizDetailDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.byId(id),
    payload,
    { timeout: QUIZ_SAVE_TIMEOUT_MS },
  );
  return unwrap(response);
}

export async function publishQuizApi(id: string) {
  const response = await apiClient.post<BackendApiResponse<QuizDetailDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.publish(id),
    { timeout: QUIZ_SAVE_TIMEOUT_MS },
  );
  return unwrap(response);
}

export async function duplicateQuizApi(id: string) {
  const response = await apiClient.post<BackendApiResponse<QuizDetailDto>>(
    QUIZ_MANAGEMENT_ENDPOINTS.duplicate(id),
    undefined,
    { timeout: QUIZ_SAVE_TIMEOUT_MS },
  );
  return unwrap(response);
}

export async function closeQuizApi(id: string) {
  const response = await apiClient.post<BackendApiResponse<null>>(
    QUIZ_MANAGEMENT_ENDPOINTS.close(id),
  );
  return unwrap(response);
}

export async function deleteQuizApi(id: string) {
  const response = await apiClient.delete<BackendApiResponse<null>>(
    QUIZ_MANAGEMENT_ENDPOINTS.byId(id),
  );
  return unwrap(response);
}
