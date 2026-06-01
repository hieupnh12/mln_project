import { MaterialIcon } from "../../../../components/teacher-icons";
import type { QuestionStatus } from "../../../types/question-library.types";

type CreateQuestionFooterProps = {
  mode?: "create" | "edit";
  editingStatus?: QuestionStatus;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving?: boolean;
};

export function CreateQuestionFooter({
  mode = "create",
  editingStatus,
  onDiscard,
  onSaveDraft,
  onPublish,
  saving = false,
}: CreateQuestionFooterProps) {
  const isEditMode = mode === "edit";
  const showDraftAction = !isEditMode || editingStatus === "Bản nháp";

  return (
    <footer className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-outline-variant/10 bg-surface-container-low px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-md">
      <button
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container-high sm:px-6"
        onClick={onDiscard}
        type="button"
      >
        <MaterialIcon>{isEditMode ? "close" : "delete"}</MaterialIcon>
        {isEditMode ? "Hủy chỉnh sửa" : "Hủy bản nháp"}
      </button>
      <div className="grid grid-cols-1 gap-3 sm:flex sm:items-center">
        {showDraftAction ? (
          <button
            className="rounded-lg border border-secondary px-3 py-2.5 text-label-md font-medium text-secondary transition hover:bg-secondary/5 disabled:opacity-50 sm:px-6"
            disabled={saving}
            onClick={onSaveDraft}
            type="button"
          >
            Lưu nháp
          </button>
        ) : null}
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-label-md font-medium text-on-primary shadow-lg transition active:scale-95 hover:opacity-90 disabled:opacity-50 sm:px-8"
          disabled={saving}
          onClick={onPublish}
          type="button"
        >
          <MaterialIcon>{isEditMode ? "save" : "add_circle"}</MaterialIcon>
          {isEditMode ? "Cập nhật câu hỏi" : "Tạo câu hỏi"}
        </button>
      </div>
    </footer>
  );
}
