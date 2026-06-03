import { useEffect, useState } from "react";

import { ModalOverlay } from "../../../question-library/components/modals/modal-overlay";
import { MaterialIcon } from "../../../components/teacher-icons";
import { CourseStructureModalPanel } from "./course-structure-modal-panel";

type NameFormModalProps = {
  open: boolean;
  title: string;
  label: string;
  submitLabel: string;
  initialValue?: string;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
};

export function NameFormModal({
  open,
  title,
  label,
  submitLabel,
  initialValue = "",
  isPending = false,
  onClose,
  onSubmit,
}: NameFormModalProps) {
  const normalizedInitialValue = initialValue ?? "";
  const [value, setValue] = useState(normalizedInitialValue);

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? "");
    }
  }, [open, initialValue]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = (value ?? "").trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
  }

  const trimmedValue = (value ?? "").trim();

  return (
    <ModalOverlay labelledBy="name-form-title" onClose={onClose} open={open}>
      <CourseStructureModalPanel>
        <form className="p-gutter" onSubmit={handleSubmit}>
          <div className="mb-md flex items-center justify-between gap-sm">
            <h2 className="text-headline-md font-semibold text-primary" id="name-form-title">
              {title}
            </h2>
            <button
              aria-label="Đóng"
              className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low"
              onClick={onClose}
              type="button"
            >
              <MaterialIcon>close</MaterialIcon>
            </button>
          </div>

          <label className="block space-y-xs">
            <span className="text-label-md font-medium text-on-surface-variant">{label}</span>
            <input
              autoFocus
              className="w-full rounded-lg border border-outline-variant/50 px-md py-sm text-body-md outline-none focus:border-secondary"
              onChange={(event) => setValue(event.target.value)}
              value={value ?? ""}
            />
          </label>

          <div className="mt-lg flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
            <button
              className="rounded-lg border border-outline-variant px-5 py-2 text-label-md font-medium text-primary"
              disabled={isPending}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary disabled:opacity-60"
              disabled={isPending || !trimmedValue}
              type="submit"
            >
              {isPending ? "Đang lưu..." : submitLabel}
            </button>
          </div>
        </form>
      </CourseStructureModalPanel>
    </ModalOverlay>
  );
}
