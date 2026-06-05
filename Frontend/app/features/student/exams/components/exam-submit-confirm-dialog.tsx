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
  if (!open) {
    return null;
  }

  const title = autoSubmit ? "Hết thời gian làm bài" : "Xác nhận nộp bài";
  const description = autoSubmit
    ? "Thời gian làm bài đã kết thúc. Hệ thống sẽ nộp bài với các câu bạn đã trả lời."
    : unansweredCount > 0
      ? `Bạn còn ${unansweredCount} câu chưa trả lời. Sau khi nộp bài, bạn không thể chỉnh sửa.`
      : "Bạn đã trả lời đủ các câu hỏi. Xác nhận nộp bài kiểm tra?";

  return (
    <div
      aria-labelledby="exam-submit-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end justify-center p-gutter sm:items-center"
      role="dialog"
    >
      <button
        aria-label="Đóng"
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
        disabled={isSubmitting}
        onClick={onCancel}
        type="button"
      />
      <article className="relative z-10 box-border w-full min-w-[280px] max-w-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-gutter shadow-lg sm:rounded-xl">
        <div className="mb-md grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-error-container"
          >
            <MaterialIcon className="text-error" size="md">
              {autoSubmit ? "timer" : "done"}
            </MaterialIcon>
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold leading-snug text-primary" id="exam-submit-dialog-title">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {!autoSubmit ? (
            <button
              className="order-2 rounded-lg border border-outline-variant px-4 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50 sm:order-1"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
            >
              Tiếp tục làm bài
            </button>
          ) : null}
          <button
            className="order-1 rounded-lg bg-primary px-4 py-2.5 text-label-md font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? "Đang nộp bài..." : autoSubmit ? "Nộp bài ngay" : "Nộp bài"}
          </button>
        </div>
      </article>
    </div>
  );
}
