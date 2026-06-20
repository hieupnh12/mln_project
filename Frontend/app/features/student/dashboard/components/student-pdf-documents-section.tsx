import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Files,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { usePdfDocumentsQuery } from "~/shared/hooks/use-pdf-documents";
import { studentDashboardAccentClasses } from "../constants/student-dashboard.constants";
import { StudentDashboardSectionHeader } from "./student-dashboard-section-header";

const INITIAL_DOCUMENT_COUNT = 3;

export function StudentPdfDocumentsSection() {
  const documentsQuery = usePdfDocumentsQuery();
  const [showAll, setShowAll] = useState(false);
  const documents = documentsQuery.data ?? [];
  const visibleDocuments = showAll
    ? documents
    : documents.slice(0, INITIAL_DOCUMENT_COUNT);

  return (
    <section className="space-y-md scroll-mt-24" id="documents">
      <StudentDashboardSectionHeader
        accent="gold"
        action={
          !documentsQuery.isLoading &&
          documents.length > INITIAL_DOCUMENT_COUNT ? (
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-landing-gold/35 bg-landing-gold/10 px-4 py-2 text-label-md font-semibold text-landing-text-muted transition hover:bg-landing-gold/15"
              onClick={() => setShowAll((current) => !current)}
              type="button"
            >
              {showAll ? "Thu gọn" : "Xem tất cả"}
              {showAll ? (
                <ChevronUp aria-hidden="true" className="h-4 w-4" />
              ) : (
                <ChevronDown aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          ) : null
        }
        description="Giáo trình và tài liệu do giảng viên chia sẻ."
        eyebrow="Học liệu"
        icon={Files}
        title="Tài liệu học tập"
      />

      {documentsQuery.isLoading ? (
        <div className="grid gap-gutter md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="h-52 animate-pulse rounded-xl border border-outline-variant/30 bg-landing-white"
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
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-landing-red px-5 py-2 text-label-md font-medium text-on-primary transition hover:bg-landing-red-deep"
            onClick={() => documentsQuery.refetch()}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Thử lại
          </button>
        </div>
      ) : null}

      {!documentsQuery.isLoading &&
      !documentsQuery.isError &&
      documentsQuery.data?.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/35 bg-landing-white p-gutter text-center shadow-lg shadow-landing-text/5">
          <FileText aria-hidden="true" className="mx-auto h-10 w-10 text-landing-red" />
          <p className="mt-4 text-headline-md font-semibold text-landing-text">
            Chưa có tài liệu PDF
          </p>
          <p className="mt-2 text-body-md text-landing-text-soft">
            Tài liệu mới từ giảng viên sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : null}

      {!documentsQuery.isLoading &&
      !documentsQuery.isError &&
      (documentsQuery.data?.length ?? 0) > 0 ? (
        <div className="grid gap-gutter md:grid-cols-2 xl:grid-cols-3">
          {visibleDocuments.map((document) => {
            const accent = studentDashboardAccentClasses.gold;

            return (
              <article
                className="group relative flex min-h-52 flex-col overflow-hidden rounded-xl border border-outline-variant/35 bg-landing-white p-5 shadow-lg shadow-landing-text/5 transition duration-300 hover:-translate-y-1 hover:border-outline/30 hover:shadow-xl"
                key={document.materialId}
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.line}`}
                />
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accent.icon}`}
                  >
                    <FileText aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-outline-variant/25 bg-landing-cream px-3 py-1 text-label-sm font-semibold text-landing-text-soft">
                    {document.pageCount ? `${document.pageCount} trang` : "PDF"}
                  </span>
                </div>

                <div className="mt-4 min-w-0 flex-1">
                  <h3 className="line-clamp-2 break-words text-body-lg font-semibold leading-6 text-landing-text">
                    {document.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-label-sm leading-5 text-landing-text-soft">
                    {document.subjectTitle} / {document.chapterTitle} /{" "}
                    {document.lessonTitle}
                  </p>
                </div>

                <a
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-text/10 transition hover:bg-primary-container"
                  href={document.resourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Tải tài liệu
                </a>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
