import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionModalId } from "../types/question-library.types";

type QuestionLibraryHeaderProps = {
  onOpenModal: (modal: QuestionModalId) => void;
};

export function QuestionLibraryHeader({ onOpenModal }: QuestionLibraryHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-headline-lg font-bold text-landing-text">Ngân hàng câu hỏi</h1>
        <p className="mt-1 text-body-md text-landing-text-soft">
          Quản lý, biên soạn và duyệt câu hỏi theo môn — chương — bài học.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-landing-white px-5 py-2.5 text-label-md font-semibold text-landing-text transition hover:bg-landing-gray/60"
          onClick={() => onOpenModal("import")}
          type="button"
        >
          <MaterialIcon>upload_file</MaterialIcon>
          Import Batch
        </button>
        <button
          className="flex items-center gap-2 rounded-xl bg-landing-red px-5 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep active:scale-[0.98]"
          onClick={() => onOpenModal("add")}
          type="button"
        >
          <MaterialIcon>add</MaterialIcon>
          Thêm câu hỏi
        </button>
      </div>
    </header>
  );
}
