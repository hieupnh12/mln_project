import { MaterialIcon } from "../../../../components/teacher-icons";
import {
  TEACHER_MODAL_BTN_PRIMARY,
  TEACHER_MODAL_BTN_SECONDARY,
} from "../../../../constants/teacher-ui.constants";
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
  const isPublishedEdit = isEditMode && editingStatus === "Đã xuất bản";
  const showDraftAction = !isEditMode || editingStatus === "Bản nháp";

  return (
    <footer className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-outline-variant/25 bg-landing-gray/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-md">
      <button
        className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text sm:px-6"
        onClick={onDiscard}
        type="button"
      >
        <MaterialIcon>{isEditMode ? "close" : "delete"}</MaterialIcon>
        {isEditMode ? "Hủy chỉnh sửa" : "Hủy bản nháp"}
      </button>
      <div className="grid grid-cols-1 gap-3 sm:flex sm:items-center">
        {showDraftAction ? (
          <button
            className={`${TEACHER_MODAL_BTN_SECONDARY} disabled:opacity-50`}
            disabled={saving}
            onClick={onSaveDraft}
            type="button"
          >
            Lưu nháp
          </button>
        ) : null}
        <button
          className={`${TEACHER_MODAL_BTN_PRIMARY} sm:px-8`}
          disabled={saving}
          onClick={onPublish}
          type="button"
        >
          <MaterialIcon>{isEditMode ? "save" : "add_circle"}</MaterialIcon>
          {isPublishedEdit
            ? "Lưu và gửi duyệt lại"
            : isEditMode
              ? "Cập nhật câu hỏi"
              : "Tạo câu hỏi"}
        </button>
      </div>
    </footer>
  );
}
