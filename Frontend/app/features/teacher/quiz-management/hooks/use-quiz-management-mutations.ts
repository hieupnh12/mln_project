import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUIZ_MANAGEMENT_QUERY_KEYS } from "../constants/quiz-management.constants";
import {
  createQuiz,
  duplicateQuiz,
  publishQuiz,
  updateQuiz,
} from "../services/quiz-management.service";
import type { QuizDetailDto, SaveQuizPayload } from "../types/quiz-management-api.types";

export function useSaveQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: SaveQuizPayload }) =>
      id ? updateQuiz(id, payload) : createQuiz(payload),
    onSuccess: (_data: QuizDetailDto) => {
      queryClient.invalidateQueries({ queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.root });
    },
  });
}

export function usePublishQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.root });
    },
  });
}

export function useDuplicateQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => duplicateQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_MANAGEMENT_QUERY_KEYS.root });
    },
  });
}
