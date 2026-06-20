import { MaterialIcon } from "../../components/teacher-icons";
import type { PdfDocument } from "~/shared/types/pdf-document.types";
import { showInfoToast } from "~/shared/utils/toast";
import { TEACHER_PORTAL_ROW_SHADOW } from "../../constants/teacher-ui.constants";

type PdfDocumentRowProps = {
  document: PdfDocument;
  isDeleting: boolean;
  onDelete: (materialId: number, documentTitle: string) => void;
};

function copyScope(document: PdfDocument) {
  const scope = [document.subjectTitle, document.chapterTitle, document.lessonTitle]
    .filter(Boolean)
    .join(" / ");

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(scope).then(() => {
      showInfoToast("Đã sao chép phạm vi tài liệu.");
    });
    return;
  }

  showInfoToast(scope);
}

export function PdfDocumentRow({ document, isDeleting, onDelete }: PdfDocumentRowProps) {
  const scope = [document.subjectTitle, document.chapterTitle]
    .filter(Boolean)
    .join(" / ");

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border border-outline-variant/25 bg-landing-gray/30 p-4 lg:flex-row lg:items-center ${TEACHER_PORTAL_ROW_SHADOW}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-catalog-cyan/12 text-catalog-cobalt">
          <MaterialIcon className="text-[22px]">picture_as_pdf</MaterialIcon>
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-landing-text">{document.title}</p>
          <p className="font-mono text-label-sm text-landing-text-soft">PDF{document.materialId}</p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 text-label-sm text-landing-text-soft lg:w-[240px]">
        <span className="truncate">{scope || "—"}</span>
        <button
          aria-label={`Sao chép phạm vi ${document.title}`}
          className="shrink-0 rounded-lg p-1 text-landing-text-soft transition hover:bg-landing-white hover:text-landing-text"
          onClick={() => copyScope(document)}
          type="button"
        >
          <MaterialIcon className="text-[18px]">content_copy</MaterialIcon>
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-2 text-label-sm text-landing-text-soft lg:w-[160px]">
        <MaterialIcon className="text-[16px]">menu_book</MaterialIcon>
        <span className="truncate">{document.lessonTitle ?? "—"}</span>
      </div>

      <span className="inline-flex w-fit rounded-full bg-landing-gold/15 px-3 py-1 text-label-sm font-medium text-landing-text-muted">
        {document.pageCount != null ? `${document.pageCount} trang` : "— trang"}
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
          onClick={() => onDelete(document.materialId, document.title)}
          title="Xóa"
          type="button"
        >
          <MaterialIcon>delete</MaterialIcon>
        </button>
      </div>
    </article>
  );
}
