import {
  createChapterApi,
  createLessonApi,
  createMaterialApi,
  deleteChapterApi,
  deleteLessonApi,
  deleteMaterialApi,
  fetchMaterialDetailApi,
  fetchStructureChapters,
  fetchStructureLessons,
  updateChapterApi,
  updateLessonApi,
} from "../api/course-structure.api";
import { DEFAULT_TEACHER_ID } from "../constants/course-structure-api.constants";
import type {
  CreateChapterPayload,
  CreateLessonPayload,
  CreateMaterialPayload,
  UpdateChapterPayload,
  UpdateLessonPayload,
} from "../types/course-structure-api.types";
import type {
  CourseStructureChapter,
  CourseStructureLesson,
  CourseStructureMaterialDetail,
} from "../types/course-structure.types";
import {
  mapChapterDto,
  mapLessonDto,
  mapMaterialDetailDto,
} from "../utils/map-course-structure-dto";

export async function getStructureChapters(subjectId: number): Promise<CourseStructureChapter[]> {
  const chapters = await fetchStructureChapters(subjectId);
  return chapters.map((chapter, index) => mapChapterDto(chapter, index + 1));
}

export async function getStructureLessons(chapterId: number): Promise<CourseStructureLesson[]> {
  const lessons = await fetchStructureLessons(chapterId);
  return lessons.map(mapLessonDto);
}

export function createChapter(subjectId: number, payload: CreateChapterPayload) {
  return createChapterApi(subjectId, payload);
}

export function updateChapter(chapterId: number, payload: UpdateChapterPayload) {
  return updateChapterApi(chapterId, payload);
}

export function deleteChapter(chapterId: number) {
  return deleteChapterApi(chapterId);
}

export function createLesson(chapterId: number, payload: CreateLessonPayload) {
  return createLessonApi(chapterId, DEFAULT_TEACHER_ID, payload);
}

export function updateLesson(lessonId: number, payload: UpdateLessonPayload) {
  return updateLessonApi(lessonId, payload);
}

export function deleteLesson(lessonId: number) {
  return deleteLessonApi(lessonId);
}

export function createMaterial(lessonId: number, payload: CreateMaterialPayload) {
  return createMaterialApi(lessonId, payload);
}

export function deleteMaterial(materialId: number) {
  return deleteMaterialApi(materialId);
}

export async function getMaterialDetail(materialId: number): Promise<CourseStructureMaterialDetail> {
  const material = await fetchMaterialDetailApi(materialId);
  return mapMaterialDetailDto(material);
}
