import type { RefObject } from "react";

import {
  TEACHER_MODAL_BTN_PRIMARY,
  TEACHER_MODAL_BTN_SECONDARY,
} from "../../constants/teacher-ui.constants";
import { SUBJECT_DOCUMENT_ACCEPT } from "../constants/subject-document.constants";

type SubjectDocumentUploadFormProps = {
  file: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  onFileChange: (file: File | null) => void;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (title: string) => void;
  title: string;
};

const fieldClassName =
  "w-full rounded-xl border-0 bg-landing-white py-2.5 px-3 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition placeholder:text-landing-text-soft focus:ring-primary/25";

export function SubjectDocumentUploadForm({
  file,
  fileInputRef,
  isUploading,
  onFileChange,
  onReset,
  onSubmit,
  onTitleChange,
  title,
}: SubjectDocumentUploadFormProps) {
  return (
    <form
      className="grid gap-4 rounded-2xl border border-outline-variant/25 bg-landing-gray/25 p-4 md:p-5"
      onSubmit={onSubmit}
    >
      <label className="space-y-1.5">
        <span className="text-label-sm font-medium text-landing-text-soft">Tên tài liệu</span>
        <input
          className={fieldClassName}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Ví dụ: Giáo trình chương 1"
          value={title}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-label-sm font-medium text-landing-text-soft">
          File (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ZIP, ảnh)
        </span>
        <input
          accept={SUBJECT_DOCUMENT_ACCEPT}
          className="block w-full rounded-xl border border-dashed border-outline-variant/45 bg-landing-white px-4 py-5 text-body-md text-landing-text-soft file:mr-4 file:rounded-lg file:border-0 file:bg-landing-gray file:px-4 file:py-2 file:text-label-md file:font-semibold file:text-landing-text"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          ref={fileInputRef}
          type="file"
        />
        {file ? (
          <p className="text-label-sm text-landing-text-muted">Đã chọn: {file.name}</p>
        ) : null}
      </label>

      <div className="flex justify-end gap-3">
        <button className={TEACHER_MODAL_BTN_SECONDARY} onClick={onReset} type="button">
          Xóa dữ liệu
        </button>
        <button
          className={`${TEACHER_MODAL_BTN_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}
          disabled={isUploading}
          type="submit"
        >
          {isUploading ? "Đang tải lên..." : "Tải lên"}
        </button>
      </div>
    </form>
  );
}
