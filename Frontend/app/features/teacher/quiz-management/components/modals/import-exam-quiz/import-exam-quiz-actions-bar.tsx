import { MaterialIcon } from "../../../../components/teacher-icons";
import {
  TEACHER_MODAL_BTN_PRIMARY,
  TEACHER_MODAL_BTN_SECONDARY,
} from "../../../../constants/teacher-ui.constants";

type ImportExamQuizActionsBarProps = {
  isProcessing: boolean;
  submittingStatus: "PENDING" | "PUBLISHED" | null;
  onCancel: () => void;
  onImportPending: () => void;
  onImportPublished: () => void;
};

export function ImportExamQuizActionsBar({
  isProcessing,
  submittingStatus,
  onCancel,
  onImportPending,
  onImportPublished,
}: ImportExamQuizActionsBarProps) {
  const importingPending = submittingStatus === "PENDING";
  const importingPublished = submittingStatus === "PUBLISHED";

  return (
    <div className="flex flex-col gap-4 border-t border-outline-variant/25 pt-lg sm:flex-row sm:items-center sm:justify-end">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="rounded-xl px-6 py-2.5 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text disabled:opacity-60"
          disabled={isProcessing}
          onClick={onCancel}
          type="button"
        >
          Hủy
        </button>
        <button
          className={`${TEACHER_MODAL_BTN_SECONDARY} disabled:opacity-70`}
          disabled={isProcessing}
          onClick={onImportPending}
          type="button"
        >
          {importingPending ? (
            <>
              <MaterialIcon className="animate-spin">sync</MaterialIcon>
              Đang import...
            </>
          ) : (
            <>
              Chờ duyệt &amp; tạo quiz
              <MaterialIcon>schedule</MaterialIcon>
            </>
          )}
        </button>
        <button
          className={`${TEACHER_MODAL_BTN_PRIMARY} disabled:opacity-70`}
          disabled={isProcessing}
          onClick={onImportPublished}
          type="button"
        >
          {importingPublished ? (
            <>
              <MaterialIcon className="animate-spin">sync</MaterialIcon>
              Đang import đề...
            </>
          ) : (
            <>
              Import &amp; tạo quiz
              <MaterialIcon>quiz</MaterialIcon>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
