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

  const secondaryButtonClass =
    "inline-flex items-center gap-1 rounded-xl border border-outline-variant/40 bg-landing-white px-3 py-2 text-label-sm font-medium text-landing-text transition hover:bg-landing-gray/60";

  return (
    <footer className="flex flex-col gap-3 border-t border-outline-variant/25 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {prevTab ? (
          <button
            className={secondaryButtonClass}
            onClick={() => onGoToTab(prevTab)}
            type="button"
          >
            <MaterialIcon className="text-[16px]">arrow_back</MaterialIcon>
            {quizEditorTabLabels[prevTab]}
          </button>
        ) : null}
        {nextTab ? (
          <button
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant/40 bg-landing-gray/50 px-3 py-2 text-label-sm font-semibold text-landing-text transition hover:bg-landing-gray/70"
            onClick={() => onGoToTab(nextTab)}
            type="button"
          >
            {quizEditorTabLabels[nextTab]}
            <MaterialIcon className="text-[16px]">arrow_forward</MaterialIcon>
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {canDelete ? (
          <button
            className="rounded-xl border border-error/30 bg-landing-white px-3 py-2 text-label-sm font-medium text-error transition hover:bg-error-container/30"
            onClick={onDelete}
            type="button"
          >
            Xóa
          </button>
        ) : null}
        {canClose ? (
          <button className={secondaryButtonClass} onClick={onClose} type="button">
            Tắt live
          </button>
        ) : null}
        {canReopen ? (
          <button
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant/40 bg-landing-gray/50 px-3 py-2 text-label-sm font-semibold text-landing-text transition hover:bg-landing-gray/70"
            onClick={onPublish}
            type="button"
          >
            <MaterialIcon className="text-[16px]">play_circle</MaterialIcon>
            Bật lại
          </button>
        ) : null}
        <button
          className={`${secondaryButtonClass} disabled:opacity-60`}
          disabled={isPublished}
          onClick={onSaveDraft}
          type="button"
        >
          Lưu nháp
        </button>
        {showPublishAction && !canReopen ? (
          <button
            className="inline-flex items-center gap-1 rounded-xl bg-landing-red px-4 py-2 text-label-sm font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep disabled:opacity-60 active:scale-[0.98]"
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
