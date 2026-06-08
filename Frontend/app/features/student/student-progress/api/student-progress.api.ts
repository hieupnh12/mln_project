import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import { STUDENT_PROGRESS_ENDPOINTS } from "../constants/student-progress-api.constants";
import type {
  StudentLessonProgressDto,
  UpdateLessonProgressPayload,
} from "../types/student-progress.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function fetchSubjectLessonProgressApi(subjectId: number) {
  const response = await apiClient.get<BackendApiResponse<StudentLessonProgressDto[]>>(
    STUDENT_PROGRESS_ENDPOINTS.subjectLessonProgress(subjectId),
  );
  return unwrap(response);
}

export async function fetchChapterLessonProgressApi(chapterId: number) {
  const response = await apiClient.get<BackendApiResponse<StudentLessonProgressDto[]>>(
    STUDENT_PROGRESS_ENDPOINTS.chapterLessonProgress(chapterId),
  );
  return unwrap(response);
}

export async function updateLessonProgressApi(
  lessonId: number,
  payload: UpdateLessonProgressPayload,
) {
  const response = await apiClient.put<BackendApiResponse<StudentLessonProgressDto>>(
    STUDENT_PROGRESS_ENDPOINTS.lessonProgress(lessonId),
    payload,
  );
  return unwrap(response);
}
