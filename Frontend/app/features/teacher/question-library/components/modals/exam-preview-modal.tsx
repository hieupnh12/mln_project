import { MaterialIcon } from "../../../components/teacher-icons";
import type { RandomExamPreviewItem } from "../../types/export-exam.types";
import { ModalOverlay } from "./modal-overlay";

type ExamPreviewModalProps = {
  open: boolean;
  items: RandomExamPreviewItem[];
  onClose: () => void;
  onSaveDraft: () => void;
  onExport: () => void;
  savingDraft?: boolean;
  exporting?: boolean;
};

const difficultyAccent: Record<
  RandomExamPreviewItem["difficulty"],
  { accent: string; labelClass: string }
> = {
  "Cơ bản": { accent: "border-secondary", labelClass: "text-secondary" },
  "Vận dụng": { accent: "border-secondary-fixed-dim", labelClass: "text-secondary" },
  "Nâng cao": { accent: "border-primary-container", labelClass: "text-primary-container" },
};

export function ExamPreviewModal({
  open,
  items,
  onClose,
  onSaveDraft,
  onExport,
  savingDraft = false,
  exporting = false,
}: ExamPreviewModalProps) {
  const busy = savingDraft || exporting;

  return (
    <ModalOverlay labelledBy="exam-preview-title" onClose={onClose} open={open}>
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-surface-container-lowest shadow-xl">
        <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-low p-6">
          <div>
            <h4
              className="text-headline-md font-semibold text-primary"
              id="exam-preview-title"
            >
              Xem trước đề thi
            </h4>
            <p className="mt-1 text-label-sm text-on-surface-variant">
              {items.length} câu hỏi — nội dung xuất file giống preview này
            </p>
          </div>
          <button
            aria-label="Đóng"
            className="rounded-full p-1 text-on-surface-variant transition hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </div>

        <div className="custom-scrollbar max-h-[min(614px,60vh)] space-y-6 overflow-y-auto p-md">
          {items.map((item, index) => {
            const style = difficultyAccent[item.difficulty];
            return (
              <div
                className={`space-y-2 rounded-lg border-l-4 bg-surface-container p-4 ${style.accent}`}
                key={item.id}
              >
                <div className="flex justify-between gap-3">
                  <span className={`text-label-sm font-bold ${style.labelClass}`}>
                    Câu {index + 1} • {item.difficulty.toUpperCase()} • {item.chapter}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">
                    {item.score} điểm • {item.timeInSeconds}s
                  </span>
                </div>
                <p className="text-body-md">{item.question}</p>
                <p className="text-label-sm text-on-surface-variant">{item.lesson}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-3 bg-surface-container-low p-6 sm:flex-row sm:justify-end">
          <button
            className="px-6 py-2 text-label-md font-medium text-on-surface-variant transition hover:text-primary"
            disabled={busy}
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="rounded-lg border-2 border-primary px-6 py-2 text-label-md font-medium text-primary transition hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy || items.length === 0}
            onClick={onSaveDraft}
            type="button"
          >
            {savingDraft ? "Đang lưu..." : "Lưu bản nháp quiz"}
          </button>
          <button
            className="rounded-lg bg-primary px-8 py-2 text-label-md font-medium text-on-primary shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy || items.length === 0}
            onClick={onExport}
            type="button"
          >
            {exporting ? "Đang xuất..." : "Xuất file Excel"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
