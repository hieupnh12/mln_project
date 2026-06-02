import type { QuizFilters, QuizListItem } from "../types/quiz-management.types";
import type { QuizListSummary } from "../utils/quiz-ui.helpers";
import { QuizFiltersBar } from "./quiz-filters-bar";
import { QuizListQuickTips, QuizListSummaryCards } from "./quiz-list-summary-cards";
import { QuizListTable } from "./quiz-list-table";

type QuizListViewProps = {
  courseOptions: string[];
  filters: QuizFilters;
  isError?: boolean;
  isLoading?: boolean;
  items: QuizListItem[];
  onCreateQuiz: () => void;
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
  onFiltersChange: (filters: QuizFilters) => void;
  onFiltersReset: () => void;
  onRetry?: () => void;
  summary: QuizListSummary;
  totalCount: number;
};

export function QuizListView({
  courseOptions,
  filters,
  isError = false,
  isLoading = false,
  items,
  onCreateQuiz,
  onDuplicate,
  onEdit,
  onFiltersChange,
  onFiltersReset,
  onRetry,
  summary,
  totalCount,
}: QuizListViewProps) {
  return (
    <section className="space-y-md">
      <QuizListSummaryCards
        activeStatus={filters.status}
        onStatusFilter={(status) => onFiltersChange({ ...filters, status })}
        summary={summary}
      />

      {isError ? (
        <div className="rounded-xl border border-error/30 bg-error-container/40 p-md">
          <p className="text-body-md text-error">Không thể tải danh sách quiz.</p>
          {onRetry ? (
            <button
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary"
              onClick={onRetry}
              type="button"
            >
              Thử lại
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-md xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-md">
          <QuizFiltersBar
            courseOptions={courseOptions}
            filters={filters}
            onChange={onFiltersChange}
            onReset={onFiltersReset}
            resultCount={items.length}
            totalCount={totalCount}
          />
          {isLoading ? (
            <div className="space-y-sm">
              <div className="h-12 animate-pulse rounded-xl bg-surface-container-low" />
              <div className="h-64 animate-pulse rounded-xl bg-surface-container-low" />
            </div>
          ) : (
            <QuizListTable
              items={items}
              onCreateQuiz={onCreateQuiz}
              onDuplicate={onDuplicate}
              onEdit={onEdit}
            />
          )}
        </div>
        <QuizListQuickTips />
      </div>
    </section>
  );
}
