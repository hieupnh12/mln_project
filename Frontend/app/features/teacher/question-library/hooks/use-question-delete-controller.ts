import { useMemo, useState } from "react";

import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showSuccessToast } from "~/shared/utils/toast";

import {
  QUESTION_DELETE_ACTIVITY,
  QUESTION_DELETE_CONFIRM_COPY,
} from "../constants/question-delete.constants";
import {
  useDeleteQuestionMutation,
  useDeleteQuestionsMutation,
} from "./use-question-library-mutations";

type DeleteTarget =
  | {
      kind: "single";
      ids: [string];
    }
  | {
      kind: "bulk";
      ids: string[];
    };

type UseQuestionDeleteControllerParams = {
  selectedCount: number;
  selectedIds: Set<string>;
  clearSelection: () => void;
  onDeletedQuestion: (id: string) => void;
};

function getDeleteErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Không thể xóa câu hỏi.";
}

export function useQuestionDeleteController({
  selectedCount,
  selectedIds,
  clearSelection,
  onDeletedQuestion,
}: UseQuestionDeleteControllerParams) {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const deleteMutation = useDeleteQuestionMutation();
  const deleteManyMutation = useDeleteQuestionsMutation();

  const isDeleting = deleteMutation.isPending || deleteManyMutation.isPending;

  const deleteDialog = useMemo(() => {
    if (!deleteTarget) {
      return null;
    }

    if (deleteTarget.kind === "single") {
      return {
        title: QUESTION_DELETE_CONFIRM_COPY.singleTitle,
        description: QUESTION_DELETE_CONFIRM_COPY.singleDescription,
        confirmLabel: QUESTION_DELETE_CONFIRM_COPY.singleConfirmLabel,
      };
    }

    return {
      title: QUESTION_DELETE_CONFIRM_COPY.bulkTitle(deleteTarget.ids.length),
      description: QUESTION_DELETE_CONFIRM_COPY.bulkDescription,
      confirmLabel: QUESTION_DELETE_CONFIRM_COPY.bulkConfirmLabel,
    };
  }, [deleteTarget]);

  function requestDeleteQuestion(id: string) {
    if (isDeleting) {
      return;
    }
    setDeleteTarget({ kind: "single", ids: [id] });
  }

  function requestDeleteSelected() {
    if (selectedCount === 0 || isDeleting) {
      return;
    }
    setDeleteTarget({ kind: "bulk", ids: [...selectedIds] });
  }

  function closeDeleteDialog() {
    if (!isDeleting) {
      setDeleteTarget(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || isDeleting) {
      return;
    }

    try {
      if (deleteTarget.kind === "single") {
        const [id] = deleteTarget.ids;
        await runWithAsyncActivity({
          id: QUESTION_DELETE_ACTIVITY.singleId,
          label: QUESTION_DELETE_ACTIVITY.singleLabel,
          simulateProgress: true,
          task: () => deleteMutation.mutateAsync(id),
        });
        onDeletedQuestion(id);
        setDeleteTarget(null);
        showSuccessToast(QUESTION_DELETE_CONFIRM_COPY.singleSuccess);
        return;
      }

      const ids = deleteTarget.ids;
      await runWithAsyncActivity({
        id: QUESTION_DELETE_ACTIVITY.bulkId,
        label: QUESTION_DELETE_ACTIVITY.bulkLabel,
        detail: `${ids.length} câu hỏi`,
        simulateProgress: true,
        task: () => deleteManyMutation.mutateAsync(ids),
      });
      clearSelection();
      setDeleteTarget(null);
      showSuccessToast(QUESTION_DELETE_CONFIRM_COPY.bulkSuccess(ids.length));
    } catch (error) {
      showErrorToast(getDeleteErrorMessage(error));
    }
  }

  return {
    closeDeleteDialog,
    confirmDelete,
    deleteDialog,
    deletingQuestionId:
      deleteMutation.isPending && deleteMutation.variables
        ? deleteMutation.variables
        : null,
    isDeleting,
    isDeletingSelected: deleteManyMutation.isPending,
    requestDeleteQuestion,
    requestDeleteSelected,
  };
}
