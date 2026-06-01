import {
  fetchChaptersBySubjectId,
  fetchLessonsByChapterId,
  fetchMaterialDetail,
} from "../api/course-learning.api";
import type {
  CourseChapterItem,
  CourseLessonItem,
  CourseMaterialDetail,
} from "../types/course-learning.types";
import {
  mapChapterDto,
  mapLessonDto,
  mapMaterialDetailDto,
} from "../utils/map-course-learning-dto";

export async function getChaptersBySubjectId(
  subjectId: number,
): Promise<CourseChapterItem[]> {
  const chapters = await fetchChaptersBySubjectId(subjectId);
  return chapters.map((chapter, index) => mapChapterDto(chapter, index + 1));
}

export async function getLessonsByChapterId(
  chapterId: number,
): Promise<CourseLessonItem[]> {
  const lessons = await fetchLessonsByChapterId(chapterId);
  return lessons.map(mapLessonDto);
}

export async function getMaterialDetail(
  materialId: number,
): Promise<CourseMaterialDetail> {
  const material = await fetchMaterialDetail(materialId);
  return mapMaterialDetailDto(material);
}
