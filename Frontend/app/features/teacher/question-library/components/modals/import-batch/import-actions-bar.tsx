import { MaterialIcon } from "../../../../components/teacher-icons";
import {
  TEACHER_MODAL_BTN_PRIMARY,
  TEACHER_MODAL_BTN_SECONDARY,
} from "../../../../constants/teacher-ui.constants";

type ImportActionsBarProps = {
  isProcessing: boolean;
  submittingStatus: "PENDING" | "PUBLISHED" | null;
  onCancel: () => void;
  onImportPending: () => void;
  onImportPublished: () => void;
};

export function ImportActionsBar({
  isProcessing,
  submittingStatus,
  onCancel,
  onImportPending,
  onImportPublished,
}: ImportActionsBarProps) {
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
          Hủy import
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
              Chờ duyệt
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
              Đang import...
            </>
          ) : (
            <>
              Hoàn tất &amp; Import
              <MaterialIcon>arrow_forward</MaterialIcon>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
