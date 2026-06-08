import { MaterialIcon } from "../../components/teacher-icons";
import { quizEditorTabLabels } from "../constants/quiz-management.constants";
import type { QuizEditorTab } from "../types/quiz-management.types";

const tabOrder: QuizEditorTab[] = ["settings", "questions", "publish"];

type QuizEditorFooterProps = {
  activeTab: QuizEditorTab;
  canClose: boolean;
  canDelete: boolean;
  canPublish: boolean;
  canReopen: boolean;
  isPublished: boolean;
  onClose: () => void;
  onDelete: () => void;
  onGoToTab: (tab: QuizEditorTab) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
};

export function QuizEditorFooter({
  activeTab,
  canClose,
  canDelete,
  canPublish,
  canReopen,
  isPublished,
  onClose,
  onDelete,
  onGoToTab,
  onPublish,
  onSaveDraft,
}: QuizEditorFooterProps) {
  const currentIndex = tabOrder.indexOf(activeTab);
  const prevTab = currentIndex > 0 ? tabOrder[currentIndex - 1] : null;
  const nextTab = currentIndex < tabOrder.length - 1 ? tabOrder[currentIndex + 1] : null;
  const showPublishAction = activeTab === "publish" && (canReopen || !isPublished);

  return (
    <footer className="flex flex-col gap-sm border-t border-outline-variant/15 pt-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {prevTab ? (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/30 bg-white px-3 py-1.5 text-label-sm font-medium text-primary transition hover:bg-surface-container-low"
            onClick={() => onGoToTab(prevTab)}
            type="button"
          >
            <MaterialIcon className="text-[16px]">arrow_back</MaterialIcon>
            {quizEditorTabLabels[prevTab]}
          </button>
        ) : null}
        {nextTab ? (
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-secondary-container px-3 py-1.5 text-label-sm font-semibold text-primary transition hover:opacity-90"
            onClick={() => onGoToTab(nextTab)}
            type="button"
          >
            {quizEditorTabLabels[nextTab]}
            <MaterialIcon className="text-[16px]">arrow_forward</MaterialIcon>
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {canDelete ? (
          <button
            className="rounded-lg border border-error/30 bg-white px-3 py-1.5 text-label-sm font-medium text-error transition hover:bg-error-container/30"
            onClick={onDelete}
            type="button"
          >
            Xóa
          </button>
        ) : null}
        {canClose ? (
          <button
            className="rounded-lg border border-outline-variant/30 bg-white px-3 py-1.5 text-label-sm font-medium text-primary transition hover:bg-surface-container-low"
            onClick={onClose}
            type="button"
          >
            Tắt live
          </button>
        ) : null}
        {canReopen ? (
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-secondary-container px-3 py-1.5 text-label-sm font-semibold text-primary transition hover:opacity-90"
            onClick={onPublish}
            type="button"
          >
            <MaterialIcon className="text-[16px]">play_circle</MaterialIcon>
            Bật lại
          </button>
        ) : null}
        <button
          className="rounded-lg border border-outline-variant/30 bg-white px-3 py-1.5 text-label-sm font-medium text-primary transition hover:bg-surface-container-low disabled:opacity-60"
          disabled={isPublished}
          onClick={onSaveDraft}
          type="button"
        >
          Lưu nháp
        </button>
        {showPublishAction && !canReopen ? (
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-label-sm font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-60"
            disabled={!canPublish || isPublished}
            onClick={onPublish}
            type="button"
          >
            <MaterialIcon className="text-[16px]">publish</MaterialIcon>
            Xuất bản
          </button>
        ) : null}
      </div>
    </footer>
  );
}
