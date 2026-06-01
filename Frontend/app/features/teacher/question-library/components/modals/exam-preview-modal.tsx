import { MaterialIcon } from "../../../components/teacher-icons";
import { examPreviewSamples } from "../../constants/export-exam.constants";
import { ModalOverlay } from "./modal-overlay";

type ExamPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  onFinalize: () => void;
};

export function ExamPreviewModal({
  open,
  onClose,
  onFinalize,
}: ExamPreviewModalProps) {
  return (
    <ModalOverlay labelledBy="exam-preview-title" onClose={onClose} open={open}>
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-surface-container-lowest shadow-xl">
        <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-low p-6">
          <h4
            className="text-headline-md font-semibold text-primary"
            id="exam-preview-title"
          >
            Xem trước đề thi
          </h4>
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
          {examPreviewSamples.map((item) => (
            <div
              className={`space-y-2 rounded-lg border-l-4 bg-surface-container p-4 ${item.accent}`}
              key={item.id}
            >
              <div className="flex justify-between">
                <span className={`text-label-sm font-bold ${item.labelClass}`}>
                  {item.id} • {item.difficulty.toUpperCase()} • {item.chapter}
                </span>
                <span className="text-label-sm text-on-surface-variant">
                  {item.points} điểm
                </span>
              </div>
              <p className="text-body-md">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 bg-surface-container-low p-6">
          <button
            className="px-6 py-2 text-label-md font-medium text-on-surface-variant transition hover:text-primary"
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="rounded-lg bg-primary px-8 py-2 text-label-md font-medium text-on-primary shadow-md transition hover:shadow-lg"
            onClick={onFinalize}
            type="button"
          >
            Hoàn tất đề thi
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
