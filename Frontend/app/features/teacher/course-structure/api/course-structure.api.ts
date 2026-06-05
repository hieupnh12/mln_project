import { apiClient } from "~/shared/services/api-client";
import type { BackendApiResponse } from "~/shared/types/api.types";

import { COURSE_STRUCTURE_ENDPOINTS } from "../constants/course-structure-api.constants";
import type {
  ChapterDto,
  CreateChapterPayload,
  CreateLessonPayload,
  CreateMaterialPayload,
  LessonWithMaterialsDto,
  MaterialDetailDto,
  UpdateChapterPayload,
  UpdateLessonPayload,
  LessonDetailDto,
} from "../types/course-structure-api.types";

function unwrap<T>(response: { data: BackendApiResponse<T> }): T {
  return response.data.result;
}

export async function fetchStructureChapters(subjectId: number) {
  const response = await apiClient.get<BackendApiResponse<ChapterDto[]>>(
    COURSE_STRUCTURE_ENDPOINTS.chaptersBySubject(subjectId),
  );
  return unwrap(response);
}

export async function fetchStructureLessons(chapterId: number) {
  const response = await apiClient.get<BackendApiResponse<LessonWithMaterialsDto[]>>(
    COURSE_STRUCTURE_ENDPOINTS.lessonsByChapter(chapterId),
  );
  return unwrap(response);
}

export async function createChapterApi(subjectId: number, payload: CreateChapterPayload) {
  const response = await apiClient.post<BackendApiResponse<ChapterDto>>(
    COURSE_STRUCTURE_ENDPOINTS.createChapter(subjectId),
    payload,
  );
  return unwrap(response);
}

export async function updateChapterApi(chapterId: number, payload: UpdateChapterPayload) {
  const response = await apiClient.patch<BackendApiResponse<ChapterDto>>(
    COURSE_STRUCTURE_ENDPOINTS.updateChapter(chapterId),
    payload,
  );
  return unwrap(response);
}

export async function deleteChapterApi(chapterId: number) {
  await apiClient.delete(COURSE_STRUCTURE_ENDPOINTS.deleteChapter(chapterId));
}

export async function createLessonApi(
  chapterId: number,
  payload: CreateLessonPayload,
) {
  const response = await apiClient.post(
    COURSE_STRUCTURE_ENDPOINTS.createLesson(chapterId),
    payload,
  );
  return response.data;
}

export async function updateLessonApi(lessonId: number, payload: UpdateLessonPayload) {
  await apiClient.patch(
    COURSE_STRUCTURE_ENDPOINTS.updateLesson(lessonId),
    payload,
  );
}

export async function fetchLessonDetailApi(lessonId: number): Promise<LessonDetailDto> {
  const response = await apiClient.get<BackendApiResponse<LessonDetailDto>>(
    COURSE_STRUCTURE_ENDPOINTS.lessonDetail(lessonId),
  );
  return unwrap(response);
}

export async function fetchChapterDetailApi(chapterId: number): Promise<ChapterDto> {
  const response = await apiClient.get<BackendApiResponse<ChapterDto>>(
    `/chapters/detail/${chapterId}`
  );
  return unwrap(response);
}

export async function deleteLessonApi(lessonId: number) {
  await apiClient.delete(COURSE_STRUCTURE_ENDPOINTS.deleteLesson(lessonId));
}

export async function createMaterialApi(lessonId: number, payload: CreateMaterialPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);

  if (payload.youtubeUrl?.trim()) {
    formData.append("youtubeUrl", payload.youtubeUrl.trim());
  }

  payload.files?.forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiClient.post(
    COURSE_STRUCTURE_ENDPOINTS.createMaterial(lessonId),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function deleteMaterialApi(materialId: number) {
  await apiClient.delete(COURSE_STRUCTURE_ENDPOINTS.deleteMaterial(materialId));
}

export async function fetchMaterialDetailApi(materialId: number) {
  const response = await apiClient.get<BackendApiResponse<MaterialDetailDto>>(
    COURSE_STRUCTURE_ENDPOINTS.materialDetail(materialId),
  );
  return unwrap(response);
}
