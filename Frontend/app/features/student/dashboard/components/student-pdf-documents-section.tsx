import { useState } from "react";

import { usePdfDocumentsQuery } from "~/shared/hooks/use-pdf-documents";
import { StudentMaterialIcon as MaterialIcon } from "../../components/student-material-icon";

const INITIAL_DOCUMENT_COUNT = 3;

export function StudentPdfDocumentsSection() {
  const documentsQuery = usePdfDocumentsQuery();
  const [showAll, setShowAll] = useState(false);
  const documents = documentsQuery.data ?? [];
  const visibleDocuments = showAll
    ? documents
    : documents.slice(0, INITIAL_DOCUMENT_COUNT);

  return (
    <section className="space-y-md" id="documents">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-xs">
          <h2 className="text-headline-lg font-semibold text-primary">
            Tài liệu PDF
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Giáo trình và tài liệu đọc do giảng viên chia sẻ.
          </p>
        </div>
        {!documentsQuery.isLoading && documents.length > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-label-md font-medium text-on-surface-variant">
              {documents.length} tài liệu
            </span>
            {documents.length > INITIAL_DOCUMENT_COUNT ? (
              <button
                className="rounded-lg border border-outline-variant/50 bg-white px-4 py-2 text-label-md font-semibold text-primary transition hover:bg-surface-container-low"
                onClick={() => setShowAll((current) => !current)}
                type="button"
              >
                {showAll ? "Thu gọn" : "Xem tất cả"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {documentsQuery.isLoading ? (
        <div className="grid gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="h-44 animate-pulse rounded-xl border border-outline-variant/30 bg-surface-container-low"
              key={index}
            />
          ))}
        </div>
      ) : null}

      {documentsQuery.isError ? (
        <div className="rounded-xl border border-error/30 bg-error-container/40 p-gutter">
          <p className="text-body-md font-medium text-error">
            Không thể tải danh sách tài liệu PDF.
          </p>
          <button
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-label-md font-medium text-on-primary"
            onClick={() => documentsQuery.refetch()}
            type="button"
          >
            Thử lại
          </button>
        </div>
      ) : null}

      {!documentsQuery.isLoading &&
      !documentsQuery.isError &&
      documentsQuery.data?.length === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-white p-gutter text-center">
          <MaterialIcon className="mx-auto mb-3 text-[40px] text-error">
            picture_as_pdf
          </MaterialIcon>
          <p className="text-headline-md font-semibold text-primary">
            Chưa có tài liệu PDF
          </p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Tài liệu mới từ giảng viên sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : null}

      {!documentsQuery.isLoading &&
      !documentsQuery.isError &&
      (documentsQuery.data?.length ?? 0) > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleDocuments.map((document) => (
            <article
              className="flex min-h-36 flex-col rounded-xl border border-outline-variant/40 bg-white p-4 shadow-[0_4px_20px_rgba(35,39,51,0.04)]"
              key={document.materialId}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-container text-error">
                  <MaterialIcon>picture_as_pdf</MaterialIcon>
                </div>
                <span className="rounded-full bg-surface-container-low px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                  {document.pageCount ? `${document.pageCount} trang` : "PDF"}
                </span>
              </div>

              <div className="mt-3 min-w-0 flex-1">
                <h3 className="line-clamp-1 break-words text-body-lg font-semibold text-primary">
                  {document.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-label-sm text-on-surface-variant">
                  {document.subjectTitle} / {document.chapterTitle} / {document.lessonTitle}
                </p>
              </div>

              <a
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary transition hover:opacity-90"
                href={document.resourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                <MaterialIcon>download</MaterialIcon>
                Tải tài liệu
              </a>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
