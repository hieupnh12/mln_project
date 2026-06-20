import { useEffect, useState } from "react";

import { MaterialIcon } from "../../../../components/teacher-icons";
import { TEACHER_MODAL_BTN_PRIMARY, TEACHER_MODAL_SHELL } from "../../../../constants/teacher-ui.constants";
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`max-h-[calc(100vh-32px)] w-full max-w-lg overflow-y-auto p-lg transition-all duration-300 ${TEACHER_MODAL_SHELL} ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-catalog-cyan/12">
          <MaterialIcon className="text-4xl text-catalog-cobalt">check_circle</MaterialIcon>
        </div>
        <h4
          className="mb-2 text-center text-headline-md font-semibold text-landing-text"
          id="import-success-title"
        >
          Import hoàn tất
        </h4>
        <p className="mb-6 text-center text-body-md text-landing-text-soft">
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
            <p className="mb-2 text-label-md font-semibold text-landing-text">Dòng cần kiểm tra</p>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {issueRows.map((row, index) => (
                <div
                  className="rounded-xl border border-outline-variant/25 bg-landing-gray/30 px-3 py-2"
                  key={`${row.rowId}-${index}`}
                >
                  <p className="text-label-md font-medium text-landing-text">
                    {row.rowId || `Dòng ${index + 1}`}
                  </p>
                  <p className="text-body-sm text-landing-text-soft">
                    {row.message || "Không thể xử lý dòng này."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <button className={`${TEACHER_MODAL_BTN_PRIMARY} w-full`} onClick={onClose} type="button">
          Quay lại ngân hàng
        </button>
      </div>
    </div>
  );
}

function ResultCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-landing-gray/35 p-3">
      <p className="text-title-md font-semibold text-landing-text">{value.toLocaleString("vi-VN")}</p>
      <p className="text-label-sm text-landing-text-soft">{label}</p>
    </div>
  );
}
