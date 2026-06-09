import { apiClient, ApiRequestError } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import {
  EXAMS_API_ENDPOINTS,
  EXAM_REVIEW_TIMEOUT_MS,
  EXAM_SUBMIT_TIMEOUT_MS,
} from "../constants/exams-api.constants";
import type { StudentQuizCatalogDto } from "../types/exams-api.types";
import type {
  StudentExamSessionDto,
  SubmitExamRequestDto,
  SubmitExamResultDto,
} from "../types/exam-session-api.types";
import type { ExamReview } from "../types/exam-review.types";
import type { ExamSummary } from "../types/exam-summary.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  if (response.data.result == null) {
    throw new ApiRequestError({
      message: response.data.message ?? "API không trả về dữ liệu bài kiểm tra.",
    });
  }

  return response.data.result;
}

export async function fetchExamCatalog(subjectId: number, completedLimit = 50) {
  const response = await apiClient.get<BackendApiResponse<StudentQuizCatalogDto>>(
    EXAMS_API_ENDPOINTS.catalog(subjectId),
    { params: { completedLimit } },
  );
  return unwrap(response);
}

export async function fetchExamSession(subjectId: number, quizId: string) {
  const response = await apiClient.get<BackendApiResponse<StudentExamSessionDto>>(
    EXAMS_API_ENDPOINTS.session(subjectId, quizId),
  );
  return unwrap(response);
}

export async function submitExam(
  subjectId: number,
  quizId: string,
  body: SubmitExamRequestDto,
) {
  const response = await apiClient.post<BackendApiResponse<SubmitExamResultDto>>(
    EXAMS_API_ENDPOINTS.submit(subjectId, quizId),
    body,
    { timeout: EXAM_SUBMIT_TIMEOUT_MS },
  );
  return unwrap(response);
}

export async function fetchExamSummary(subjectId: number, attemptId: string) {
  const response = await apiClient.get<BackendApiResponse<ExamSummary>>(
    EXAMS_API_ENDPOINTS.summary(subjectId, attemptId),
  );
  return unwrap(response);
}

export async function fetchExamReview(subjectId: number, attemptId: string) {
  const response = await apiClient.get<BackendApiResponse<ExamReview>>(
    EXAMS_API_ENDPOINTS.review(subjectId, attemptId),
    { timeout: EXAM_REVIEW_TIMEOUT_MS },
  );
  return unwrap(response);
}
