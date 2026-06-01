import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUESTION_LIBRARY_QUERY_KEYS } from "../constants/question-library.constants";
import {
  approveQuestion,
  batchImportQuestions,
  bulkApproveQuestions,
  createQuestion,
  deleteQuestion,
  deleteQuestions,
  updateQuestion,
} from "../services/question-library.service";
import type {
  BatchImportPayload,
  CreateQuestionPayload,
} from "../types/question-library-api.types";

export function useCreateQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) => createQuestion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
    },
  });
}

export function useUpdateQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateQuestionPayload }) =>
      updateQuestion(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
      queryClient.invalidateQueries({
        queryKey: QUESTION_LIBRARY_QUERY_KEYS.question(variables.id),
      });
    },
  });
}

export function useBatchImportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchImportPayload) => batchImportQuestions(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
    },
  });
}

export function useApproveQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
    },
  });
}

export function useBulkApproveQuestionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => bulkApproveQuestions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
    },
  });
}

export function useDeleteQuestionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
    },
  });
}

export function useDeleteQuestionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteQuestions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
    },
  });
}
