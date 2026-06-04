import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import { PRACTICE_ENDPOINTS } from "../constants/practice-api.constants";
import type { PracticeQuestionDto } from "../types/practice-api.types";
import type { PracticeScope } from "../types/practice.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function fetchPracticeQuestions(
  subjectId: number,
  scope: PracticeScope,
  size: number,
) {
  const response = await apiClient.get<BackendApiResponse<PracticeQuestionDto[]>>(
    PRACTICE_ENDPOINTS.practiceQuestions(subjectId),
    {
      params: {
        chapterId: scope.chapterId ?? undefined,
        lessonId: scope.lessonId ?? undefined,
        size,
      },
    },
  );
  return unwrap(response);
}

export async function fetchPracticeQuestionCount(
  subjectId: number,
  scope: PracticeScope,
) {
  const response = await apiClient.get<BackendApiResponse<number>>(
    PRACTICE_ENDPOINTS.practiceQuestionCount(subjectId),
    {
      params: {
        chapterId: scope.chapterId ?? undefined,
        lessonId: scope.lessonId ?? undefined,
      },
    },
  );
  return unwrap(response);
}
