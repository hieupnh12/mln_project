import { createPortal } from "react-dom";

import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

type ExamSubmitConfirmDialogProps = {
  open: boolean;
  unansweredCount: number;
  isSubmitting: boolean;
  autoSubmit?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ExamSubmitConfirmDialog({
  open,
  unansweredCount,
  isSubmitting,
  autoSubmit = false,
  onConfirm,
  onCancel,
}: ExamSubmitConfirmDialogProps) {
  if (!open || typeof document === "undefined") {
    return null;
  }

  const title = autoSubmit ? "Hết thời gian làm bài" : "Xác nhận nộp bài";
  const description = autoSubmit
    ? "Thời gian làm bài đã kết thúc. Hệ thống sẽ nộp bài với các câu bạn đã trả lời."
    : unansweredCount > 0
      ? `Bạn còn ${unansweredCount} câu chưa trả lời. Sau khi nộp bài, bạn không thể chỉnh sửa.`
      : "Bạn đã trả lời đủ các câu hỏi. Xác nhận nộp bài kiểm tra?";

  return createPortal(
    <div
      aria-describedby="exam-submit-dialog-description"
      aria-labelledby="exam-submit-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-margin-mobile"
      role="dialog"
    >
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
        disabled={isSubmitting}
        onClick={onCancel}
        type="button"
      />
      <article
        className="relative z-10 flex min-w-0 flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-lg"
        style={{
          maxHeight: "calc(100dvh - 2rem)",
          width: "min(28rem, calc(100vw - 2rem))",
        }}
      >
        <div className="flex min-h-0 items-start gap-3 overflow-y-auto p-4 sm:gap-4 sm:p-gutter">
          <div
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
              autoSubmit ? "bg-error-container" : "bg-secondary-container"
            }`}
          >
            <MaterialIcon
              className={autoSubmit ? "text-error" : "text-on-secondary-container"}
              size="md"
            >
              {autoSubmit ? "timer" : "done"}
            </MaterialIcon>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h2
              className="break-words text-base font-semibold leading-snug text-primary sm:text-lg"
              id="exam-submit-dialog-title"
            >
              {title}
            </h2>
            <p
              className="mt-1.5 break-words text-sm leading-relaxed text-on-surface-variant"
              id="exam-submit-dialog-description"
            >
              {description}
            </p>
          </div>
          {!isSubmitting && !autoSubmit ? (
            <button
              aria-label="Đóng hộp thoại"
              className="shrink-0 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              onClick={onCancel}
              type="button"
            >
              <MaterialIcon className="text-[20px]">close</MaterialIcon>
            </button>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-outline-variant/20 bg-surface-container-lowest p-4 sm:flex-row sm:justify-end sm:px-gutter sm:py-4">
          {!autoSubmit ? (
            <button
              className="min-h-11 w-full rounded-lg border border-outline-variant px-4 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              Tiếp tục làm bài
            </button>
          ) : null}
          <button
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? (
              <MaterialIcon className="animate-spin text-[18px]">progress_activity</MaterialIcon>
            ) : null}
            {isSubmitting ? "Đang nộp bài..." : autoSubmit ? "Nộp bài ngay" : "Nộp bài"}
          </button>
        </div>
      </article>
    </div>,
    document.body,
  );
}
