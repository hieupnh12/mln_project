import { useQuery } from "@tanstack/react-query";

import { getSubjectById, getAllSubjects } from "~/features/student/services/student.service";
import { SUBJECT_QUERY_KEYS } from "~/features/student/constants/student-api.constants";

import { COURSE_STRUCTURE_QUERY_KEYS } from "../constants/course-structure-api.constants";
import {
  getStructureChapters,
  getStructureLessons,
  getMaterialDetail,
} from "../services/course-structure.service";

const isBrowser = typeof window !== "undefined";

export function useTeacherSubjectsQuery() {
  return useQuery({
    queryKey: COURSE_STRUCTURE_QUERY_KEYS.subjects,
    queryFn: getAllSubjects,
    enabled: isBrowser,
  });
}

export function useTeacherSubjectQuery(subjectId: number | null) {
  return useQuery({
    queryKey:
      subjectId == null
        ? COURSE_STRUCTURE_QUERY_KEYS.root
        : COURSE_STRUCTURE_QUERY_KEYS.subject(subjectId),
    queryFn: () => getSubjectById(subjectId as number),
    enabled: isBrowser && subjectId != null,
  });
}

export function useStructureChaptersQuery(subjectId: number | null) {
  return useQuery({
    queryKey:
      subjectId == null
        ? COURSE_STRUCTURE_QUERY_KEYS.root
        : COURSE_STRUCTURE_QUERY_KEYS.chapters(subjectId),
    queryFn: () => getStructureChapters(subjectId as number),
    enabled: isBrowser && subjectId != null,
  });
}

export function useStructureLessonsQuery(chapterId: number | null) {
  return useQuery({
    queryKey:
      chapterId == null
        ? COURSE_STRUCTURE_QUERY_KEYS.root
        : COURSE_STRUCTURE_QUERY_KEYS.lessons(chapterId),
    queryFn: () => getStructureLessons(chapterId as number),
    enabled: isBrowser && chapterId != null,
  });
}

export function useMaterialDetailQuery(materialId: number | null) {
  return useQuery({
    queryKey:
      materialId == null
        ? COURSE_STRUCTURE_QUERY_KEYS.root
        : COURSE_STRUCTURE_QUERY_KEYS.material(materialId),
    queryFn: () => getMaterialDetail(materialId as number),
    enabled: isBrowser && materialId != null,
  });
}
