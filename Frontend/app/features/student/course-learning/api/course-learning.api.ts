import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";
import { getBackendRootUrl } from "~/shared/utils/backend-root-url";

import { COURSE_LEARNING_ENDPOINTS } from "../constants/course-learning-api.constants";
import type {
  ChapterDto,
  LessonWithMaterialsDto,
  MaterialDetailDto,
} from "../types/course-learning-api.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

function rootRequestConfig() {
  return { baseURL: getBackendRootUrl() };
}

export async function fetchChaptersBySubjectId(subjectId: number) {
  const response = await apiClient.get<BackendApiResponse<ChapterDto[]>>(
    COURSE_LEARNING_ENDPOINTS.chaptersBySubject(subjectId),
    rootRequestConfig(),
  );
  return unwrap(response);
}

export async function fetchLessonsByChapterId(chapterId: number) {
  const response = await apiClient.get<BackendApiResponse<LessonWithMaterialsDto[]>>(
    COURSE_LEARNING_ENDPOINTS.lessonsByChapter(chapterId),
    rootRequestConfig(),
  );
  return unwrap(response);
}

export async function fetchMaterialDetail(materialId: number) {
  const response = await apiClient.get<BackendApiResponse<MaterialDetailDto>>(
    COURSE_LEARNING_ENDPOINTS.materialDetail(materialId),
    rootRequestConfig(),
  );
  return unwrap(response);
}
