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
import type {
  CourseStructureChapter,
  CourseStructureLesson,
} from "../types/course-structure.types";

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
  const queryKey = COURSE_STRUCTURE_QUERY_KEYS.chapters(subjectId);

  return useMutation({
    mutationFn: ({ chapterId, payload }: { chapterId: number; payload: UpdateChapterPayload }) =>
      updateChapter(chapterId, payload),
    onMutate: async ({ chapterId, payload }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousChapters = queryClient.getQueryData<CourseStructureChapter[]>(queryKey);

      queryClient.setQueryData<CourseStructureChapter[]>(queryKey, (old) =>
        old?.map((chapter) =>
          chapter.id === chapterId ? { ...chapter, title: payload.title ?? chapter.title } : chapter,
        ),
      );

      return { previousChapters };
    },
    onError: (err, variables, context) => {
      if (context?.previousChapters) {
        queryClient.setQueryData(queryKey, context.previousChapters);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
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
  const queryKey = COURSE_STRUCTURE_QUERY_KEYS.lessons(chapterId);

  return useMutation({
    mutationFn: ({ lessonId, payload }: { lessonId: number; payload: UpdateLessonPayload }) =>
      updateLesson(lessonId, payload),
    onMutate: async ({ lessonId, payload }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLessons = queryClient.getQueryData<CourseStructureLesson[]>(queryKey);

      queryClient.setQueryData<CourseStructureLesson[]>(queryKey, (old) =>
        old?.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, title: payload.title ?? lesson.title } : lesson,
        ),
      );

      return { previousLessons };
    },
    onError: (err, variables, context) => {
      if (context?.previousLessons) {
        queryClient.setQueryData(queryKey, context.previousLessons);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
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
