import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as flashcardService from "../services/flashcard.service";
import type {
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
} from "../types/flashcard.types";

const QUERY_KEYS = {
  sets: ["teacher", "flashcard-sets"] as const,
  flashcards: (lessonId: number) =>
    ["teacher", "flashcards", lessonId] as const,
};

export function useTeacherFlashcardSets() {
  return useQuery({
    queryKey: QUERY_KEYS.sets,
    queryFn: () => flashcardService.getFlashcardSets(),
  });
}

export function useFlashcardsByLesson(lessonId: number, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.flashcards(lessonId),
    queryFn: () => flashcardService.getFlashcards(lessonId),
    enabled: enabled && lessonId > 0,
  });
}

export function useCreateFlashcard(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateFlashcardRequest) =>
      flashcardService.addFlashcard(lessonId, request),
    onSuccess: () => {
      // Invalidate the flashcard list for this specific lesson
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(lessonId),
      });
      // Invalidate the sets list to update counts
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
    },
  });
}

export function useUpdateFlashcard(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: UpdateFlashcardRequest;
    }) => flashcardService.editFlashcard(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(lessonId),
      });
    },
  });
}

export function useDeleteFlashcard(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => flashcardService.removeFlashcard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
    },
  });
}

export function useCreateFlashcardsBulk(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requests: CreateFlashcardRequest[]) =>
      flashcardService.addFlashcardsBulk(lessonId, requests),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
    },
  });
}
