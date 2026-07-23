import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as flashcardService from "../services/flashcard.service";
import type {
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
  Flashcard,
} from "../types/flashcard.types";

const QUERY_KEYS = {
  sets: ["teacher", "flashcard-sets"] as const,
  flashcards: (chapterId: number | string) =>
    ["teacher", "flashcards", Number(chapterId)] as const,
};

export function useTeacherFlashcardSets() {
  return useQuery({
    queryKey: QUERY_KEYS.sets,
    queryFn: () => flashcardService.getFlashcardSets(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useFlashcardsByChapter(chapterId: number | string, enabled = true) {
  const numericId = Number(chapterId);
  return useQuery({
    queryKey: QUERY_KEYS.flashcards(numericId),
    queryFn: async () => {
      console.log("[useFlashcardsByChapter queryFn] Fetching cards for chapter:", numericId);
      const data = await flashcardService.getFlashcards(numericId);
      console.log("[useFlashcardsByChapter queryFn] Received cards:", data);
      return data;
    },
    enabled: enabled && numericId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chapterId,
      request,
    }: {
      chapterId: number | string;
      request: CreateFlashcardRequest;
    }) => flashcardService.addFlashcard(Number(chapterId), request),
    onSuccess: (data, variables) => {
      const numericId = Number(variables.chapterId);
      console.log("=== useCreateFlashcard onSuccess ===");
      console.log("variables:", variables);
      console.log("numericId:", numericId);
      console.log("Saved flashcard data returned from API:", data);
      console.log("Cache key to invalidate:", QUERY_KEYS.flashcards(numericId));
      
      // Invalidate the flashcard list for this specific chapter
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(numericId),
      });
      // Invalidate the sets list to update counts
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
      // Invalidate student course dashboard cache to sync immediately
      queryClient.invalidateQueries({
        queryKey: ["student", "flashcard-sets"],
      });
      console.log("Query invalidation triggered.");
    },
  });
}

export function useUpdateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chapterId,
      id,
      request,
    }: {
      chapterId: number | string;
      id: number;
      request: UpdateFlashcardRequest;
    }) => flashcardService.editFlashcard(id, request),
    onMutate: async ({ chapterId, id, request }) => {
      const numericId = Number(chapterId);
      const queryKey = QUERY_KEYS.flashcards(numericId);
      await queryClient.cancelQueries({ queryKey });

      const previousCards = queryClient.getQueryData<Flashcard[]>(queryKey);

      queryClient.setQueryData<Flashcard[]>(queryKey, (old) =>
        old?.map((card) =>
          card.id === id ? { ...card, ...request } : card,
        ),
      );

      return { previousCards, chapterId: numericId };
    },
    onError: (err, variables, context) => {
      if (context?.previousCards) {
        queryClient.setQueryData(
          QUERY_KEYS.flashcards(context.chapterId),
          context.previousCards,
        );
      }
    },
    onSettled: (data, error, variables) => {
      const numericId = Number(variables.chapterId);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(numericId),
      });
      queryClient.invalidateQueries({
        queryKey: ["student", "flashcard-sets"],
      });
    },
  });
}

export function useDeleteFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chapterId,
      cardId,
    }: {
      chapterId: number | string;
      cardId: number;
    }) => flashcardService.removeFlashcard(cardId),
    onSuccess: (data, variables) => {
      const numericId = Number(variables.chapterId);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(numericId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
      queryClient.invalidateQueries({
        queryKey: ["student", "flashcard-sets"],
      });
    },
  });
}

export function useCreateFlashcardsBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chapterId,
      requests,
    }: {
      chapterId: number | string;
      requests: CreateFlashcardRequest[];
    }) => flashcardService.addFlashcardsBulk(Number(chapterId), requests),
    onSuccess: (data, variables) => {
      const numericId = Number(variables.chapterId);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flashcards(numericId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sets,
      });
      queryClient.invalidateQueries({
        queryKey: ["student", "flashcard-sets"],
      });
    },
  });
}
