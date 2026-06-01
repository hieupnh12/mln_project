import { ModalOverlay } from "../../../question-library/components/modals/modal-overlay";
import { MaterialIcon } from "../../../components/teacher-icons";
import { CourseStructureModalPanel } from "./course-structure-modal-panel";

type ConfirmDeleteModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  open,
  title,
  description,
  confirmLabel = "Xóa",
  isPending = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <ModalOverlay labelledBy="confirm-delete-title" onClose={onClose} open={open}>
      <CourseStructureModalPanel>
        <div className="p-gutter">
          <div className="mb-md flex items-start gap-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-error-container text-error">
              <MaterialIcon className="text-[20px]">warning</MaterialIcon>
            </div>
            <div className="min-w-0">
              <h2 className="text-headline-md font-semibold text-primary" id="confirm-delete-title">
                {title}
              </h2>
              <p className="mt-1 text-label-md text-on-surface-variant">{description}</p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            <button
              className="rounded-lg border border-outline-variant px-5 py-2 text-label-md font-medium text-primary transition hover:bg-surface-container-low"
              disabled={isPending}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="rounded-lg bg-error px-5 py-2 text-label-md font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              disabled={isPending}
              onClick={onConfirm}
              type="button"
            >
              {isPending ? "Đang xóa..." : confirmLabel}
            </button>
          </div>
        </div>
      </CourseStructureModalPanel>
    </ModalOverlay>
  );
}
