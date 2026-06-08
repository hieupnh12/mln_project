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
