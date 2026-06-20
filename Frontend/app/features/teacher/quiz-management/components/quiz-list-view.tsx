import type { QuizFilters, QuizListItem } from "../types/quiz-management.types";
import { QuizFiltersBar } from "./quiz-filters-bar";
import { QuizListTable } from "./quiz-list-table";

type QuizListViewProps = {
  courseOptions: string[];
  filters: QuizFilters;
  isError?: boolean;
  isLoading?: boolean;
  items: QuizListItem[];
  onClose: (id: string) => void;
  onCreateQuiz: () => void;
  onDelete: (id: string) => void;
  onReopen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
  onFiltersChange: (filters: QuizFilters) => void;
  onFiltersReset: () => void;
  onRetry?: () => void;
  onSearchChange: (search: string) => void;
  totalCount: number;
};

export function QuizListView({
  courseOptions,
  filters,
  isError = false,
  isLoading = false,
  items,
  onClose,
  onCreateQuiz,
  onDelete,
  onReopen,
  onDuplicate,
  onEdit,
  onFiltersChange,
  onFiltersReset,
  onRetry,
  onSearchChange,
  totalCount,
}: QuizListViewProps) {
  return (
    <>
      {isError ? (
        <p className="rounded-2xl border border-error/20 bg-error-container/40 px-4 py-3 text-body-md text-on-error-container">
          Không thể tải danh sách quiz.{" "}
          {onRetry ? (
            <button
              className="font-medium underline hover:no-underline"
              onClick={onRetry}
              type="button"
            >
              Thử lại
            </button>
          ) : null}
        </p>
      ) : null}

      <QuizFiltersBar
        courseOptions={courseOptions}
        filters={filters}
        onChange={onFiltersChange}
        onReset={onFiltersReset}
        onSearchChange={onSearchChange}
        resultCount={items.length}
        totalCount={totalCount}
      />

      <QuizListTable
        isLoading={isLoading}
        items={items}
        onClose={onClose}
        onCreateQuiz={onCreateQuiz}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onEdit={onEdit}
        onReopen={onReopen}
        totalCount={totalCount}
      />
    </>
  );
}
