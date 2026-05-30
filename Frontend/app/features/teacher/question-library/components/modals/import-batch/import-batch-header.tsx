import { MaterialIcon } from "../../../../components/teacher-icons";

type ImportBatchHeaderProps = {
  onClose: () => void;
  onDownloadTemplate: () => void;
};

export function ImportBatchHeader({
  onClose,
  onDownloadTemplate,
}: ImportBatchHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-outline-variant/10 pb-gutter sm:flex-row sm:items-start sm:justify-between">
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
          Tải lên câu hỏi
        </h2>
        <p className="mt-2 max-w-xl text-body-md text-on-surface-variant">
          Tối ưu quy trình biên soạn bằng cách import nhiều câu hỏi cùng lúc. Hỗ trợ
          Excel và CSV theo mẫu chuẩn.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          className="flex items-center gap-2 rounded-lg border border-outline px-4 py-2 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container"
          onClick={onDownloadTemplate}
          type="button"
        >
          <MaterialIcon>download</MaterialIcon>
          Tải file mẫu
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
