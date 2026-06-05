import { LoaderCircle, Trash2, TriangleAlert } from "lucide-react";

import { ModalOverlay } from "./modal-overlay";

type ConfirmQuestionDeleteModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmQuestionDeleteModal({
  open,
  title,
  description,
  confirmLabel,
  isPending,
  onClose,
  onConfirm,
}: ConfirmQuestionDeleteModalProps) {
  return (
    <ModalOverlay labelledBy="question-delete-title" onClose={onClose} open={open}>
      <div className="mx-auto w-[min(calc(100vw-32px),32rem)] max-w-none rounded-xl border border-outline-variant/20 bg-white shadow-xl">
        <div className="p-gutter">
          <div className="mb-md grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-error">
              <TriangleAlert aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2
                className="text-headline-md font-semibold text-primary"
                id="question-delete-title"
              >
                {title}
              </h2>
              <p className="mt-1 break-words text-label-md text-on-surface-variant">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            <button
              className="w-full min-w-24 rounded-lg border border-outline-variant px-5 py-2 text-label-md font-medium text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={isPending}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="inline-flex w-full min-w-32 items-center justify-center gap-2 rounded-lg bg-error px-5 py-2 text-label-md font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={isPending}
              onClick={onConfirm}
              type="button"
            >
              {isPending ? (
                <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              )}
              {isPending ? "Đang xóa..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
