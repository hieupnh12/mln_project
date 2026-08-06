import type { SubjectDocument } from "~/shared/types/subject-document.types";

import { MaterialIcon } from "../../components/teacher-icons";
import { TEACHER_PORTAL_ROW_SHADOW } from "../../constants/teacher-ui.constants";

type SubjectDocumentRowProps = {
  document: SubjectDocument;
  isDeleting: boolean;
  onDelete: (documentId: number, documentTitle: string) => void;
};

function formatFileSize(bytes: number | null) {
  if (bytes == null || bytes <= 0) {
    return null;
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SubjectDocumentRow({
  document,
  isDeleting,
  onDelete,
}: SubjectDocumentRowProps) {
  const extension = document.fileExtension ?? "FILE";
  const sizeLabel = formatFileSize(document.fileSize);

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border border-outline-variant/25 bg-landing-gray/30 p-4 lg:flex-row lg:items-center ${TEACHER_PORTAL_ROW_SHADOW}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-catalog-cyan/12 text-catalog-cobalt">
          <MaterialIcon className="text-[22px]">description</MaterialIcon>
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-landing-text">{document.title}</p>
          <p className="truncate font-mono text-label-sm text-landing-text-soft">
            {document.originalFilename ?? `DOC${document.documentId}`}
          </p>
        </div>
      </div>

      <span className="inline-flex w-fit rounded-full bg-landing-gold/15 px-3 py-1 text-label-sm font-medium text-landing-text-muted">
        {extension}
        {sizeLabel ? ` · ${sizeLabel}` : ""}
      </span>

      <div className="flex items-center gap-2 lg:ml-auto">
        <a
          aria-label={`Tải ${document.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant/40 bg-landing-white text-landing-text-soft transition hover:bg-landing-gray/70 hover:text-landing-text"
          href={document.resourceUrl}
          rel="noreferrer"
          target="_blank"
          title="Tải xuống"
        >
          <MaterialIcon>download</MaterialIcon>
        </a>
        <button
          aria-label={`Xóa ${document.title}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-error-container text-error transition hover:opacity-80 disabled:opacity-50"
          disabled={isDeleting}
          onClick={() => onDelete(document.documentId, document.title)}
          title="Xóa"
          type="button"
        >
          <MaterialIcon>delete</MaterialIcon>
        </button>
      </div>
    </article>
  );
}
