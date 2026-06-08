import type { QuizFilters, QuizListItem } from "../types/quiz-management.types";
import { QuizFiltersBar } from "./quiz-filters-bar";
import { QuizListQuickTips } from "./quiz-list-summary-cards";
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
  totalCount,
}: QuizListViewProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-sm">
      {isError ? (
        <div className="shrink-0 rounded-lg border border-error/30 bg-error-container/40 p-sm">
          <p className="text-label-md text-error">Không thể tải danh sách quiz.</p>
          {onRetry ? (
            <button
              className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-label-sm text-on-primary"
              onClick={onRetry}
              type="button"
            >
              Thử lại
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-sm">
        <QuizListQuickTips />
        <QuizFiltersBar
          courseOptions={courseOptions}
          filters={filters}
          onChange={onFiltersChange}
          onReset={onFiltersReset}
          resultCount={items.length}
          totalCount={totalCount}
        />
        <div className="min-h-0 flex-1 overflow-auto">
          {isLoading ? (
            <div className="space-y-sm">
              <div className="h-10 animate-pulse rounded-lg bg-surface-container-low" />
              <div className="h-[50vh] min-h-[320px] animate-pulse rounded-lg bg-surface-container-low" />
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
      </div>
    </section>
  );
}
