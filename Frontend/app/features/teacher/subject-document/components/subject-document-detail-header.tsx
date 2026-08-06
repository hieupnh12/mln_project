import { Link } from "react-router";

import { MaterialIcon } from "../../components/teacher-icons";
import { SUBJECT_DOCUMENT_ROUTES } from "../constants/subject-document.constants";

type SubjectDocumentDetailHeaderProps = {
  onToggleUpload: () => void;
  showUploadForm: boolean;
  subjectCode?: string;
  subjectTitle: string;
};

export function SubjectDocumentDetailHeader({
  onToggleUpload,
  showUploadForm,
  subjectCode,
  subjectTitle,
}: SubjectDocumentDetailHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-outline-variant/25 pb-6">
      <Link
        className="inline-flex w-fit items-center gap-1.5 text-label-md font-medium text-landing-text-soft transition hover:text-landing-text"
        to={SUBJECT_DOCUMENT_ROUTES.list}
      >
        <MaterialIcon className="text-[18px]">arrow_back</MaterialIcon>
        Tất cả môn học
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {subjectCode ? (
            <span className="inline-block rounded-full bg-landing-gray px-3 py-1 text-label-sm font-semibold text-landing-text-soft">
              {subjectCode}
            </span>
          ) : null}
          <h1 className="mt-2 text-headline-lg font-bold text-landing-text">{subjectTitle}</h1>
          <p className="mt-1 max-w-2xl text-body-md text-landing-text-soft">
            Tải giáo trình, bài đọc, nhiệm vụ và hướng dẫn để học sinh tải về.
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
            {showUploadForm ? "Đóng biểu mẫu" : "Tải tài liệu lên"}
          </span>
        </button>
      </div>
    </header>
  );
}
