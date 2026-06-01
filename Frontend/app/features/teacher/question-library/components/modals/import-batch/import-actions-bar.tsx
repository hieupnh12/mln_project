import { MaterialIcon } from "../../../../components/teacher-icons";

type ImportActionsBarProps = {
  isProcessing: boolean;
  onCancel: () => void;
  onFinalize: () => void;
};

export function ImportActionsBar({
  isProcessing,
  onCancel,
  onFinalize,
}: ImportActionsBarProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-lg sm:flex-row sm:items-center sm:justify-end">
      <div className="flex gap-4">
        <button
          className="rounded-lg px-6 py-2 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container"
          disabled={isProcessing}
          onClick={onCancel}
          type="button"
        >
          Hủy import
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-primary-container px-8 py-2 text-label-md font-medium text-on-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isProcessing}
          onClick={onFinalize}
          type="button"
        >
          {isProcessing ? (
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
