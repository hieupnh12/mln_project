import { MaterialIcon } from "../../../../components/teacher-icons";
import { TEACHER_MODAL_BTN_SECONDARY } from "../../../../constants/teacher-ui.constants";

type ImportBatchHeaderProps = {
  onClose: () => void;
  onDownloadTemplate: () => void;
  breadcrumb?: string;
  title?: string;
  titleId?: string;
  subtitle?: string;
};

export function ImportBatchHeader({
  onClose,
  onDownloadTemplate,
  breadcrumb = "Ngân hàng câu hỏi",
  title = "Import câu hỏi hàng loạt",
  titleId = "import-batch-title",
  subtitle,
}: ImportBatchHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-outline-variant/25 pb-gutter lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-label-sm text-landing-text-soft">
          <span>{breadcrumb}</span>
          <MaterialIcon className="text-[14px]">chevron_right</MaterialIcon>
          <span>Import hàng loạt</span>
        </nav>
        <h2 className="text-headline-lg font-semibold text-landing-text" id={titleId}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-body-md text-landing-text-soft">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:items-end">
        <button className={TEACHER_MODAL_BTN_SECONDARY} onClick={onDownloadTemplate} type="button">
          <MaterialIcon>download</MaterialIcon>
          Tải file mẫu Excel
        </button>
        <button
          aria-label="Đóng"
          className="rounded-xl p-2 text-landing-text-soft transition hover:bg-landing-gray/60 hover:text-landing-text"
          onClick={onClose}
          type="button"
        >
          <MaterialIcon>close</MaterialIcon>
        </button>
      </div>
    </div>
  );
}
