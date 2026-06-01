import { useCallback } from "react";

import { runWithAsyncActivity } from "~/shared/utils/run-with-async-activity";
import { showErrorToast, showInfoToast, showSuccessToast } from "~/shared/utils/toast";

import { useBulkApproveQuestionsMutation } from "./use-question-library-mutations";

type UseBulkApproveSelectedOptions = {
  selectedIds: Set<string>;
  clearSelection: () => void;
};

export function useBulkApproveSelected({
  selectedIds,
  clearSelection,
}: UseBulkApproveSelectedOptions) {
  const mutation = useBulkApproveQuestionsMutation();

  const approveSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const ids = [...selectedIds];

    runWithAsyncActivity({
      id: "question-library-bulk-approve",
      label: "Đang duyệt các câu hỏi đã chọn",
      detail: `${ids.length} câu hỏi`,
      simulateProgress: true,
      task: async () => {
        const report = await mutation.mutateAsync(ids);
        clearSelection();
        if (report.approvedCount > 0) {
          showSuccessToast(`Đã duyệt và xuất bản ${report.approvedCount} câu hỏi.`);
        }
        const skippedCount =
          report.skippedNotPending + report.skippedWarning + report.notFound;
        if (skippedCount > 0) {
          showInfoToast(
            `Đã bỏ qua ${skippedCount} câu: ${report.skippedWarning} câu có cảnh báo, ${report.skippedNotPending} câu không ở trạng thái cần duyệt, ${report.notFound} câu không tồn tại.`,
          );
        }
      },
    }).catch((error) => {
      showErrorToast(error instanceof Error ? error.message : "Không thể duyệt các câu hỏi đã chọn.");
    });
  }, [clearSelection, mutation, selectedIds]);

  return {
    approveSelected,
    isApprovingSelected: mutation.isPending,
  };
}
