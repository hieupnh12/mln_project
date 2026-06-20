import { LoaderCircle, Trash2, TriangleAlert } from "lucide-react";

import {
  TEACHER_MODAL_BTN_SECONDARY,
  TEACHER_MODAL_SHELL,
} from "../../../constants/teacher-ui.constants";
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
      <div className={`mx-auto w-[min(calc(100vw-32px),32rem)] max-w-none ${TEACHER_MODAL_SHELL}`}>
        <div className="p-gutter">
          <div className="mb-md grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-error">
              <TriangleAlert aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2
                className="text-headline-md font-semibold text-landing-text"
                id="question-delete-title"
              >
                {title}
              </h2>
              <p className="mt-1 break-words text-label-md text-landing-text-soft">{description}</p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            <button
              className={`${TEACHER_MODAL_BTN_SECONDARY} w-full sm:w-auto`}
              disabled={isPending}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="inline-flex w-full min-w-32 items-center justify-center gap-2 rounded-xl bg-error px-5 py-2.5 text-label-md font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
