import { MaterialIcon } from "../../../../components/teacher-icons";

type LessonHint = {
  subject: string;
  chapter: string;
  lesson: string;
};

type ImportBatchHeaderProps = {
  onClose: () => void;
  onDownloadTemplate: () => void;
  lessonHints?: LessonHint[];
};

export function ImportBatchHeader({
  onClose,
  onDownloadTemplate,
  lessonHints = [],
}: ImportBatchHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-outline-variant/10 pb-gutter lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant/60">
          <span>Ngân hàng câu hỏi</span>
          <MaterialIcon className="text-[14px]">chevron_right</MaterialIcon>
          <span className="text-on-surface-variant">Import hàng loạt</span>
        </nav>
        <h2
          className="text-headline-lg font-semibold text-on-surface"
          id="import-batch-title"
        >
          Import câu hỏi hàng loạt
        </h2>
        <p className="mt-2 max-w-2xl text-body-md leading-relaxed text-on-surface-variant">
          Tối ưu quy trình biên soạn bằng cách import nhiều câu hỏi cùng lúc. Hỗ trợ{" "}
          <span className="font-medium text-on-surface">Excel theo mẫu chuẩn</span> — tải file
          mẫu, điền dữ liệu và upload lên hệ thống.
        </p>
        <ul className="mt-3 flex flex-col gap-1.5 text-label-sm text-on-surface-variant/80 sm:flex-row sm:flex-wrap sm:gap-x-4">
          <li className="flex items-center gap-1.5">
            <MaterialIcon className="text-[16px] text-secondary">check_circle</MaterialIcon>
            File mẫu có dropdown Môn/Chương/Bài — xem sheet Huong dan
          </li>
          <li className="flex items-center gap-1.5">
            <MaterialIcon className="text-[16px] text-secondary">check_circle</MaterialIcon>
            Dòng trống 3 cột sẽ dùng bài học mặc định
          </li>
        </ul>
        {lessonHints.length > 0 ? (
          <div className="mt-3 rounded-lg bg-surface-container-low px-3 py-2 text-label-sm text-on-surface-variant">
            <p className="font-medium text-on-surface">Tên hợp lệ trong hệ thống (ví dụ):</p>
            <ul className="mt-1 space-y-0.5">
              {lessonHints.map((hint) => (
                <li key={`${hint.subject}-${hint.chapter}-${hint.lesson}`}>
                  {hint.subject} › {hint.chapter} › {hint.lesson}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:items-end">
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary-container/30 px-4 py-2.5 text-label-md font-medium text-secondary transition hover:bg-secondary-container/50 lg:flex-none"
          onClick={onDownloadTemplate}
          type="button"
        >
          <MaterialIcon>download</MaterialIcon>
          Tải file mẫu Excel
        </button>
        <button
          aria-label="Đóng"
          className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
          onClick={onClose}
          type="button"
        >
          <MaterialIcon>close</MaterialIcon>
        </button>
      </div>
    </div>
  );
}
