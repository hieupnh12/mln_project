import { MaterialIcon } from "../../../../components/teacher-icons";

type CreateQuestionHeaderProps = {
  onClose: () => void;
};

export function CreateQuestionHeader({ onClose }: CreateQuestionHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest px-md py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container/30">
          <MaterialIcon className="text-secondary">add_box</MaterialIcon>
        </div>
        <div>
          <h1 className="text-headline-md font-semibold text-primary" id="add-question-title">
            Tạo câu hỏi mới
          </h1>
          <p className="text-label-md text-on-surface-variant">
            Cấu hình nội dung, phương án và phân loại học thuật.
          </p>
        </div>
      </div>
      <button
        aria-label="Đóng"
        className="rounded-full p-2 transition hover:bg-surface-container-high"
        onClick={onClose}
        type="button"
      >
        <MaterialIcon>close</MaterialIcon>
      </button>
    </header>
  );
}
