import { MaterialIcon } from "../../components/teacher-icons";

type PdfDocumentHeaderProps = {
  onToggleUpload: () => void;
  showUploadForm: boolean;
};

export function PdfDocumentHeader({ onToggleUpload, showUploadForm }: PdfDocumentHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-headline-lg font-bold text-landing-text">Tài liệu PDF</h1>
        <p className="mt-1 max-w-2xl text-body-md text-landing-text-soft">
          Tải giáo trình và tài liệu đọc theo từng bài học để học sinh sử dụng.
        </p>
      </div>

      <button
        className={
          showUploadForm
            ? "flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/40 bg-landing-white px-5 py-2.5 font-semibold text-landing-text transition hover:bg-landing-gray/60 sm:w-auto"
            : "flex w-full items-center justify-center gap-2 rounded-xl bg-landing-red px-5 py-2.5 font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep active:scale-[0.98] sm:w-auto"
        }
        onClick={onToggleUpload}
        type="button"
      >
        <MaterialIcon>{showUploadForm ? "close" : "upload_file"}</MaterialIcon>
        <span className="text-label-md font-medium">
          {showUploadForm ? "Đóng biểu mẫu" : "Tải PDF lên"}
        </span>
      </button>
    </header>
  );
}
