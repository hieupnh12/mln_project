import { MaterialIcon } from "../../components/teacher-icons";
import { quizEditorTabLabels } from "../constants/quiz-management.constants";
import type { QuizEditorTab } from "../types/quiz-management.types";

const tabOrder: QuizEditorTab[] = ["settings", "questions", "publish"];

type QuizEditorFooterProps = {
  activeTab: QuizEditorTab;
  canPublish: boolean;
  isPublished: boolean;
  onGoToTab: (tab: QuizEditorTab) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
};

export function QuizEditorFooter({
  activeTab,
  canPublish,
  isPublished,
  onGoToTab,
  onPublish,
  onSaveDraft,
}: QuizEditorFooterProps) {
  const currentIndex = tabOrder.indexOf(activeTab);
  const prevTab = currentIndex > 0 ? tabOrder[currentIndex - 1] : null;
  const nextTab = currentIndex < tabOrder.length - 1 ? tabOrder[currentIndex + 1] : null;

  return (
    <footer className="flex flex-col gap-sm border-t border-outline-variant/15 pt-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {prevTab ? (
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/30 bg-white px-4 py-2 text-label-md font-medium text-primary transition hover:bg-surface-container-low"
            onClick={() => onGoToTab(prevTab)}
            type="button"
          >
            <MaterialIcon>arrow_back</MaterialIcon>
            {quizEditorTabLabels[prevTab]}
          </button>
        ) : null}
        {nextTab ? (
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-secondary-container px-4 py-2 text-label-md font-semibold text-primary-container transition hover:opacity-90"
            onClick={() => onGoToTab(nextTab)}
            type="button"
          >
            Tiếp: {quizEditorTabLabels[nextTab]}
            <MaterialIcon>arrow_forward</MaterialIcon>
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg border border-outline-variant/30 bg-white px-4 py-2 text-label-md font-medium text-primary transition hover:bg-surface-container-low disabled:opacity-60"
          disabled={isPublished}
          onClick={onSaveDraft}
          type="button"
        >
          Lưu bản nháp
        </button>
        {activeTab === "publish" ? (
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-label-md font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-60"
            disabled={!canPublish || isPublished}
            onClick={onPublish}
            type="button"
          >
            <MaterialIcon>publish</MaterialIcon>
            {isPublished ? "Đã xuất bản" : "Xuất bản quiz"}
          </button>
        ) : null}
      </div>
    </footer>
  );
}
