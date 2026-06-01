import { pdfDocuments } from "../constants/teacher-dashboard.constants";
import { MaterialIcon } from "./teacher-icons";

export function PdfManager() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-lg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h3 className="text-headline-lg font-semibold text-primary">
            Tài liệu PDF
          </h3>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Quản lý giáo trình, đề cương và tài liệu đọc theo từng chương.
          </p>
        </div>
        <button className="flex w-full items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container shadow-sm sm:w-auto">
          <MaterialIcon>upload_file</MaterialIcon>
          <span className="text-label-md font-medium">Tải PDF lên</span>
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
        <div className="hidden grid-cols-[90px_minmax(0,1fr)_120px_120px_140px] gap-4 border-b border-outline-variant/20 bg-surface-container-low px-md py-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant md:grid">
          <span>Mã</span>
          <span>Tài liệu</span>
          <span>Chương</span>
          <span>Dung lượng</span>
          <span>Trạng thái</span>
        </div>
        <div className="divide-y divide-outline-variant/20">
          {pdfDocuments.map((document) => (
            <article
              className="grid gap-3 px-md py-md md:grid-cols-[90px_minmax(0,1fr)_120px_120px_140px] md:items-center"
              key={document.id}
            >
              <span className="text-label-md font-semibold text-secondary">
                {document.id}
              </span>
              <div className="flex min-w-0 items-center gap-sm">
                <MaterialIcon className="text-error">picture_as_pdf</MaterialIcon>
                <span className="break-words font-semibold text-primary">
                  {document.title}
                </span>
              </div>
              <span className="text-label-md font-medium text-on-surface-variant">
                {document.chapter}
              </span>
              <span className="text-label-md font-medium text-on-surface-variant">
                {document.size}
              </span>
              <span className="w-fit rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-secondary">
                {document.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
