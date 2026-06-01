import { useMutation, useQueryClient } from "@tanstack/react-query";

import { COURSE_STRUCTURE_QUERY_KEYS } from "../constants/course-structure-api.constants";
import {
  createChapter,
  createLesson,
  createMaterial,
  deleteChapter,
  deleteLesson,
  deleteMaterial,
  updateChapter,
  updateLesson,
} from "../services/course-structure.service";
import type {
  CreateChapterPayload,
  CreateLessonPayload,
  CreateMaterialPayload,
  UpdateChapterPayload,
  UpdateLessonPayload,
} from "../types/course-structure-api.types";

export function useCreateChapterMutation(subjectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChapterPayload) => createChapter(subjectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.chapters(subjectId),
      });
    },
  });
}

export function useUpdateChapterMutation(subjectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterId, payload }: { chapterId: number; payload: UpdateChapterPayload }) =>
      updateChapter(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.chapters(subjectId),
      });
    },
  });
}

export function useDeleteChapterMutation(subjectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterId: number) => deleteChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.chapters(subjectId),
      });
    },
  });
}

export function useCreateLessonMutation(chapterId: number, subjectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLessonPayload) => createLesson(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.lessons(chapterId),
      });
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.chapters(subjectId),
      });
    },
  });
}

export function useUpdateLessonMutation(chapterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, payload }: { lessonId: number; payload: UpdateLessonPayload }) =>
      updateLesson(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.lessons(chapterId),
      });
    },
  });
}

export function useDeleteLessonMutation(chapterId: number, subjectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: number) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.lessons(chapterId),
      });
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.chapters(subjectId),
      });
    },
  });
}

export function useCreateMaterialMutation(chapterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      payload,
    }: {
      lessonId: number;
      payload: CreateMaterialPayload;
    }) => createMaterial(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.lessons(chapterId),
      });
    },
  });
}

export function useDeleteMaterialMutation(chapterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: number) => deleteMaterial(materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSE_STRUCTURE_QUERY_KEYS.lessons(chapterId),
      });
    },
  });
}
