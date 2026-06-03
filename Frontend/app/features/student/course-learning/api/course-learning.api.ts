import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import { COURSE_LEARNING_ENDPOINTS } from "../constants/course-learning-api.constants";
import type {
  ChapterDto,
  LessonWithMaterialsDto,
  MaterialDetailDto,
} from "../types/course-learning-api.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function fetchChaptersBySubjectId(subjectId: number) {
  const response = await apiClient.get<BackendApiResponse<ChapterDto[]>>(
    COURSE_LEARNING_ENDPOINTS.chaptersBySubject(subjectId),
  );
  return unwrap(response);
}

export async function fetchLessonsByChapterId(chapterId: number) {
  const response = await apiClient.get<BackendApiResponse<LessonWithMaterialsDto[]>>(
    COURSE_LEARNING_ENDPOINTS.lessonsByChapter(chapterId),
  );
  return unwrap(response);
}

export async function fetchMaterialDetail(materialId: number) {
  const response = await apiClient.get<BackendApiResponse<MaterialDetailDto>>(
    COURSE_LEARNING_ENDPOINTS.materialDetail(materialId),
  );
  return unwrap(response);
}
