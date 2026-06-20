import { MaterialIcon } from "../../../../components/teacher-icons";

type CreateQuestionHeaderProps = {
  mode?: "create" | "edit";
  onClose: () => void;
};

export function CreateQuestionHeader({ mode = "create", onClose }: CreateQuestionHeaderProps) {
  const isEditMode = mode === "edit";

  return (
    <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-outline-variant/25 bg-landing-white px-4 py-4 sm:items-center sm:px-md">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-catalog-cyan/12 text-catalog-cobalt sm:flex">
          <MaterialIcon>{isEditMode ? "edit" : "add_box"}</MaterialIcon>
        </div>
        <div className="min-w-0">
          <h1
            className="text-body-lg font-semibold text-landing-text sm:text-headline-md"
            id="add-question-title"
          >
            {isEditMode ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
          </h1>
          <p className="mt-1 text-label-sm text-landing-text-soft sm:text-label-md">
            {isEditMode
              ? "Cập nhật nội dung, phương án và phân loại học thuật."
              : "Cấu hình nội dung, phương án và phân loại học thuật."}
          </p>
        </div>
      </div>
      <button
        aria-label="Đóng"
        className="shrink-0 rounded-xl p-2 text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text"
        onClick={onClose}
        type="button"
      >
        <MaterialIcon>close</MaterialIcon>
      </button>
    </header>
  );
}
