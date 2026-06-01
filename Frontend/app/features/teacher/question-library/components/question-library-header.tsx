import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionModalId } from "../types/question-library.types";

type QuestionLibraryHeaderProps = {
  onOpenModal: (modal: QuestionModalId) => void;
};

export function QuestionLibraryHeader({ onOpenModal }: QuestionLibraryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-headline-lg font-semibold text-primary-container">
          Ngân hàng câu hỏi
        </h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Quản lý và biên soạn kho tài liệu học thuật Academic
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-label-md font-medium text-on-primary shadow-sm transition hover:opacity-90 active:scale-95"
          onClick={() => onOpenModal("add")}
          type="button"
        >
          <MaterialIcon>add</MaterialIcon>
          Thêm câu hỏi
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-secondary-container px-6 py-2.5 text-label-md font-medium text-on-secondary-container transition hover:bg-secondary-fixed-dim active:scale-95"
          onClick={() => onOpenModal("import")}
          type="button"
        >
          <MaterialIcon>upload_file</MaterialIcon>
          Import Batch
        </button>
      </div>
    </div>
  );
}
