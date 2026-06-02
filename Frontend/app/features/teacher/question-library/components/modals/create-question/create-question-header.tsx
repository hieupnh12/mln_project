import { MaterialIcon } from "../../../../components/teacher-icons";

type CreateQuestionHeaderProps = {
  mode?: "create" | "edit";
  onClose: () => void;
};

export function CreateQuestionHeader({ mode = "create", onClose }: CreateQuestionHeaderProps) {
  const isEditMode = mode === "edit";

  return (
    <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-outline-variant/10 bg-surface-container-lowest px-4 py-4 sm:items-center sm:px-md">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container/30 sm:flex">
          <MaterialIcon className="text-secondary">{isEditMode ? "edit" : "add_box"}</MaterialIcon>
        </div>
        <div className="min-w-0">
          <h1 className="text-body-lg font-semibold text-primary sm:text-headline-md" id="add-question-title">
            {isEditMode ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
          </h1>
          <p className="mt-1 text-label-sm text-on-surface-variant sm:text-label-md">
            {isEditMode
              ? "Cập nhật nội dung, phương án và phân loại học thuật."
              : "Cấu hình nội dung, phương án và phân loại học thuật."}
          </p>
        </div>
      </div>
      <button
        aria-label="Đóng"
        className="shrink-0 rounded-full p-2 transition hover:bg-surface-container-high"
        onClick={onClose}
        type="button"
      >
        <MaterialIcon>close</MaterialIcon>
      </button>
    </header>
  );
}
