import { useQuery } from "@tanstack/react-query";

import { getSubjectById } from "../../services/student.service";
import { SUBJECT_QUERY_KEYS } from "../../constants/student-api.constants";
import { COURSE_LEARNING_QUERY_KEYS } from "../constants/course-learning-api.constants";
import {
  getChaptersBySubjectId,
  getLessonsByChapterId,
  getMaterialDetail,
} from "../services/course-learning.service";

const isBrowser = typeof window !== "undefined";

export function useCourseSubjectQuery(subjectId: number | null) {
  return useQuery({
    queryKey: subjectId == null ? SUBJECT_QUERY_KEYS.root : SUBJECT_QUERY_KEYS.detail(subjectId),
    queryFn: () => getSubjectById(subjectId as number),
    enabled: isBrowser && subjectId != null && !Number.isNaN(subjectId),
  });
}

export function useCourseChaptersQuery(subjectId: number | null) {
  return useQuery({
    queryKey:
      subjectId == null
        ? COURSE_LEARNING_QUERY_KEYS.root
        : COURSE_LEARNING_QUERY_KEYS.chapters(subjectId),
    queryFn: () => getChaptersBySubjectId(subjectId as number),
    enabled: isBrowser && subjectId != null && !Number.isNaN(subjectId),
  });
}

export function useChapterLessonsQuery(chapterId: number | null) {
  return useQuery({
    queryKey:
      chapterId == null
        ? COURSE_LEARNING_QUERY_KEYS.root
        : COURSE_LEARNING_QUERY_KEYS.lessons(chapterId),
    queryFn: () => getLessonsByChapterId(chapterId as number),
    enabled: isBrowser && chapterId != null,
  });
}

export function useMaterialDetailQuery(materialId: number | null) {
  return useQuery({
    queryKey:
      materialId == null
        ? COURSE_LEARNING_QUERY_KEYS.root
        : COURSE_LEARNING_QUERY_KEYS.material(materialId),
    queryFn: () => getMaterialDetail(materialId as number),
    enabled: isBrowser && materialId != null,
  });
}
