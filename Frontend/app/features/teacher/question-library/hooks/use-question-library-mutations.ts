import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query";

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
import type { QuestionListResult } from "../types/question-library.types";

type QuestionListSnapshot = [QueryKey, QuestionListResult | undefined][];

type DeleteMutationContext = {
  previousLists: QuestionListSnapshot;
};

function removeQuestionsFromCachedLists(
  queryClient: QueryClient,
  deletedIds: string[],
) {
  const deletedIdSet = new Set(deletedIds);

  queryClient.setQueriesData<QuestionListResult>(
    { queryKey: QUESTION_LIBRARY_QUERY_KEYS.questionsRoot },
    (current) => {
      if (!current) {
        return current;
      }

      const nextItems = current.items.filter((item) => !deletedIdSet.has(item.id));
      const removedCount = current.items.length - nextItems.length;

      if (removedCount === 0) {
        return current;
      }

      return {
        ...current,
        items: nextItems,
        total: Math.max(0, current.total - removedCount),
      };
    },
  );
}

function restoreQuestionListSnapshot(
  queryClient: QueryClient,
  previousLists?: QuestionListSnapshot,
) {
  previousLists?.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
}

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
    onMutate: async (id): Promise<DeleteMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: QUESTION_LIBRARY_QUERY_KEYS.questionsRoot,
      });
      const previousLists = queryClient.getQueriesData<QuestionListResult>({
        queryKey: QUESTION_LIBRARY_QUERY_KEYS.questionsRoot,
      });

      removeQuestionsFromCachedLists(queryClient, [id]);

      return { previousLists };
    },
    onError: (_error, _id, context) => {
      restoreQuestionListSnapshot(queryClient, context?.previousLists);
    },
    onSettled: (_data, error, id) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
      if (!error) {
        queryClient.removeQueries({
          exact: true,
          queryKey: QUESTION_LIBRARY_QUERY_KEYS.question(id),
        });
      }
    },
  });
}

export function useDeleteQuestionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteQuestions(ids),
    onMutate: async (ids): Promise<DeleteMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: QUESTION_LIBRARY_QUERY_KEYS.questionsRoot,
      });
      const previousLists = queryClient.getQueriesData<QuestionListResult>({
        queryKey: QUESTION_LIBRARY_QUERY_KEYS.questionsRoot,
      });

      removeQuestionsFromCachedLists(queryClient, ids);

      return { previousLists };
    },
    onError: (_error, _ids, context) => {
      restoreQuestionListSnapshot(queryClient, context?.previousLists);
    },
    onSettled: (_data, error, ids) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_LIBRARY_QUERY_KEYS.root });
      if (!error) {
        ids.forEach((id) => {
          queryClient.removeQueries({
            exact: true,
            queryKey: QUESTION_LIBRARY_QUERY_KEYS.question(id),
          });
        });
      }
    },
  });
}
