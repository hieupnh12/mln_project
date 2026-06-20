import type { QuestionListItem } from "../../question-library/types/question-library.types";
import { TeacherOverviewQuestionRow } from "./teacher-overview-question-row";

type TeacherOverviewQuestionListProps = {
  isError?: boolean;
  isLoading?: boolean;
  items: QuestionListItem[];
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
};

function buildVisiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

export function TeacherOverviewQuestionList({
  isError = false,
  isLoading = false,
  items,
  onPageChange,
  page,
  totalPages,
}: TeacherOverviewQuestionListProps) {
  const visiblePages = buildVisiblePages(page, totalPages);

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-headline-md font-bold text-landing-text">Câu hỏi gần đây</h2>
        <p className="text-label-sm text-landing-text-soft">
          Trang {page} / {totalPages}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-landing-gray/40 p-md text-body-md text-landing-text-soft">
          Đang tải danh sách câu hỏi...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-2xl border border-error/30 bg-error-container/30 p-md text-label-md font-medium text-error">
          Không thể tải danh sách câu hỏi.
        </div>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-landing-gray/25 p-lg text-center text-body-md text-landing-text-soft">
          Không có câu hỏi phù hợp bộ lọc.
        </div>
      ) : null}

      {!isLoading && !isError && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <TeacherOverviewQuestionRow item={item} key={item.id} />
          ))}
        </div>
      ) : null}

      {totalPages > 1 ? (
        <nav aria-label="Phân trang câu hỏi" className="flex justify-center gap-2 pt-2">
          <button
            aria-label="Trang trước"
            className="flex h-9 w-9 items-center justify-center rounded-full text-landing-text-soft transition hover:bg-landing-gray/70 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            type="button"
          >
            ‹
          </button>

          {visiblePages.map((pageNumber) => {
            const isActive = pageNumber === page;

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-label-md font-semibold transition ${
                  isActive
                    ? "bg-landing-red text-on-primary shadow-md shadow-landing-red/20"
                    : "text-landing-text-soft hover:bg-landing-gray/70"
                }`}
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            aria-label="Trang sau"
            className="flex h-9 w-9 items-center justify-center rounded-full text-landing-text-soft transition hover:bg-landing-gray/70 disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            type="button"
          >
            ›
          </button>
        </nav>
      ) : null}
    </section>
  );
}
