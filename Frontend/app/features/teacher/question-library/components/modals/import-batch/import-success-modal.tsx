import { useEffect, useState } from "react";

import { MaterialIcon } from "../../../../components/teacher-icons";

type ImportSuccessModalProps = {
  open: boolean;
  importedCount: number;
  onClose: () => void;
};

export function ImportSuccessModal({
  open,
  importedCount,
  onClose,
}: ImportSuccessModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 10);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div
      aria-labelledby="import-success-title"
      aria-modal="true"
      className="glass-overlay fixed inset-0 z-[60] flex items-center justify-center bg-primary-container/40 p-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className={
          visible
            ? "w-full max-w-sm scale-100 rounded-xl bg-surface p-lg opacity-100 shadow-2xl transition-all duration-300"
            : "w-full max-w-sm scale-95 rounded-xl bg-surface p-lg opacity-0 shadow-2xl transition-all duration-300"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container/30">
          <MaterialIcon className="text-4xl text-secondary">check_circle</MaterialIcon>
        </div>
        <h4
          className="mb-2 text-center text-headline-md font-semibold text-primary"
          id="import-success-title"
        >
          Import thành công
        </h4>
        <p className="mb-8 text-center text-body-md text-on-surface-variant">
          {importedCount.toLocaleString("vi-VN")} câu hỏi đã được thêm vào Ngân hàng
          câu hỏi.
        </p>
        <button
          className="w-full rounded-lg bg-primary-container py-3 text-label-md font-medium text-on-primary transition hover:bg-primary"
          onClick={onClose}
          type="button"
        >
          Quay lại ngân hàng
        </button>
      </div>
    </div>
  );
}
