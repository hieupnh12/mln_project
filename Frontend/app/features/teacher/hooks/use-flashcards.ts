import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as flashcardService from "../services/flashcard.service";
import type {
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
  Flashcard,
} from "../types/flashcard.types";

const QUERY_KEYS = {
  sets: ["teacher", "flashcard-sets"] as const,
  flashcards: (chapterId: number) =>
    ["teacher", "flashcards", chapterId] as const,
};

export function useTeacherFlashcardSets() {
  return useQuery({
    queryKey: QUERY_KEYS.sets,
    queryFn: () => flashcardService.getFlashcardSets(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useFlashcardsByChapter(chapterId: number, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.flashcards(chapterId),
    queryFn: () => flashcardService.getFlashcards(chapterId),
    enabled: enabled && chapterId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCreateFlashcard(chapterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateFlashcardRequest) =>
      flashcardService.addFlashcard(chapterId, request),
    onSuccess: () => {
      // Invalidate the flashcard list for this specific chapter
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(chapterId),
      });
      // Invalidate the sets list to update counts
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
    },
  });
}

export function useUpdateFlashcard(chapterId: number) {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.flashcards(chapterId);

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: UpdateFlashcardRequest;
    }) => flashcardService.editFlashcard(id, request),
    onMutate: async ({ id, request }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousCards = queryClient.getQueryData<Flashcard[]>(queryKey);

      queryClient.setQueryData<Flashcard[]>(queryKey, (old) =>
        old?.map((card) =>
          card.id === id ? { ...card, ...request } : card,
        ),
      );

      return { previousCards };
    },
    onError: (err, variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(queryKey, context.previousCards);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteFlashcard(chapterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => flashcardService.removeFlashcard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(chapterId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
    },
  });
}

export function useCreateFlashcardsBulk(chapterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requests: CreateFlashcardRequest[]) =>
      flashcardService.addFlashcardsBulk(chapterId, requests),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(chapterId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
    },
  });
}
