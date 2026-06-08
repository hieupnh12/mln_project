import { MaterialIcon } from "../../../../components/teacher-icons";

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
    <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-lg sm:flex-row sm:items-center sm:justify-end">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="rounded-lg px-6 py-2 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container"
          disabled={isProcessing}
          onClick={onCancel}
          type="button"
        >
          Hủy import
        </button>
        <button
          className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant/30 px-6 py-2 text-label-md font-medium text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-70"
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
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-8 py-2 text-label-md font-medium text-on-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
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
