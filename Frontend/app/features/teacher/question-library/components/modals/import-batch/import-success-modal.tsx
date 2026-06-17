import { useEffect, useState } from "react";

import { MaterialIcon } from "../../../../components/teacher-icons";
import type { BatchImportReportDto } from "../../../types/question-library-api.types";

type ImportSuccessModalProps = {
  open: boolean;
  report: BatchImportReportDto | null;
  onClose: () => void;
};

export function ImportSuccessModal({
  open,
  report,
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

  if (!open || !report) return null;

  const issueRows = report.rows.filter(
    (row) => row.status !== "SAVED" && row.status !== "SAVED_SIMILAR",
  );

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
            ? "max-h-[calc(100vh-32px)] w-full max-w-lg scale-100 overflow-y-auto rounded-xl bg-surface p-lg opacity-100 shadow-2xl transition-all duration-300"
            : "max-h-[calc(100vh-32px)] w-full max-w-lg scale-95 overflow-y-auto rounded-xl bg-surface p-lg opacity-0 shadow-2xl transition-all duration-300"
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
          Import hoàn tất
        </h4>
        <p className="mb-6 text-center text-body-md text-on-surface-variant">
          Đã lưu {report.savedCount.toLocaleString("vi-VN")}/
          {report.totalRows.toLocaleString("vi-VN")} dòng vào ngân hàng câu hỏi.
        </p>
        <div className="mb-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <ResultCount label="Đã lưu" value={report.savedCount} />
          <ResultCount label="Trùng" value={report.skippedExactDuplicate} />
          <ResultCount label="Tương tự" value={report.markedSimilar} />
          <ResultCount label="Không hợp lệ" value={report.failedValidation} />
        </div>
        {issueRows.length > 0 ? (
          <div className="mb-6">
            <p className="mb-2 text-label-md font-semibold text-on-surface">
              Dòng cần kiểm tra
            </p>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {issueRows.map((row, index) => (
                <div
                  className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2"
                  key={`${row.rowId}-${index}`}
                >
                  <p className="text-label-md font-medium text-on-surface">
                    {row.rowId || `Dòng ${index + 1}`}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">
                    {row.message || "Không thể xử lý dòng này."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
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

function ResultCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-surface-container-low p-3">
      <p className="text-title-md font-semibold text-primary">{value.toLocaleString("vi-VN")}</p>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );
}
