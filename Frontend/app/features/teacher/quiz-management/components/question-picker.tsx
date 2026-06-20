import { MaterialIcon } from "../../components/teacher-icons";
import { truncateText } from "../../question-library/utils/truncate-text";
import type { QuestionListItem } from "../../question-library/types/question-library.types";

type QuestionPickerProps = {
  candidateCount: number;
  difficultyFilter: string;
  hasActiveFilter: boolean;
  isCandidateSearchPending?: boolean;
  isGeneratingRandom?: boolean;
  isLoading?: boolean;
  onAdd: (question: QuestionListItem) => void;
  onDifficultyFilterChange: (value: string) => void;
  onGenerateRandom: () => void;
  onSearchChange: (value: string) => void;
  page: number;
  pageSize: number;
  questions: QuestionListItem[];
  randomCount: number;
  search: string;
  selectedIds: string[];
  totalFiltered: number;
};

const difficultyOptions = [
  { value: "all", label: "Tất cả độ khó" },
  { value: "Cơ bản", label: "Cơ bản" },
  { value: "Vận dụng", label: "Vận dụng" },
  { value: "Nâng cao", label: "Nâng cao" },
] as const;

export function QuestionPicker({
  candidateCount,
  difficultyFilter,
  hasActiveFilter,
  isCandidateSearchPending = false,
  isGeneratingRandom = false,
  isLoading = false,
  onAdd,
  onDifficultyFilterChange,
  onGenerateRandom,
  onSearchChange,
  page,
  pageSize,
  questions,
  randomCount,
  search,
  selectedIds,
  totalFiltered,
}: QuestionPickerProps) {
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const rangeStart = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalFiltered);
  const randomTarget = Math.min(randomCount, candidateCount);
  const showLoading = isLoading || isCandidateSearchPending;

  return (
    <section className="flex h-full max-h-[min(65vh,520px)] min-h-[320px] flex-col overflow-hidden rounded-lg border border-outline-variant/20 bg-white shadow-sm">
      <header className="flex shrink-0 flex-col gap-3 border-b border-outline-variant/10 bg-surface-container-lowest px-gutter py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-label-md font-semibold text-primary-container">
            Ngân hàng câu hỏi
          </h4>
          <p className="text-label-sm text-on-surface-variant">
            {candidateCount.toLocaleString("vi-VN")} câu trong phạm vi quiz
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-secondary-container px-4 py-2 text-label-md font-medium text-primary transition hover:bg-secondary-fixed-dim disabled:opacity-60"
          disabled={candidateCount === 0 || isGeneratingRandom}
          onClick={onGenerateRandom}
          type="button"
        >
          {isGeneratingRandom ? (
            <>
              <SpinnerIcon />
              Đang random...
            </>
          ) : (
            <>
              <MaterialIcon>casino</MaterialIcon>
              Random {randomTarget} câu
            </>
          )}
        </button>
      </header>

      <div className="shrink-0 space-y-gutter border-b border-outline-variant/10 bg-surface-container-low p-gutter">
        <div className="relative">
          <MaterialIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </MaterialIcon>
          <input
            autoComplete="off"
            className="block min-h-10 w-full rounded-lg border border-outline-variant/20 bg-white py-2 pl-10 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-secondary/20"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm theo nội dung, tiêu đề hoặc mã Q-..."
            type="search"
            value={search}
          />
        </div>
        <select
          className="w-full rounded-lg border-outline-variant/30 bg-white p-2 text-label-md font-medium text-on-surface focus:ring-2 focus:ring-secondary/20 sm:max-w-xs"
          onChange={(event) => onDifficultyFilterChange(event.target.value)}
          value={difficultyFilter}
        >
          {difficultyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {showLoading && hasActiveFilter ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
        ) : null}

        {!hasActiveFilter ? (
          <div className="flex flex-col items-center gap-2 px-gutter py-xl text-center text-label-md text-on-surface-variant">
            <MaterialIcon className="text-[32px] text-secondary">manage_search</MaterialIcon>
            <p>Tìm kiếm hoặc chọn độ khó để duyệt ngân hàng.</p>
            <p className="text-label-sm">Giao diện giống trang Ngân hàng câu hỏi.</p>
          </div>
        ) : showLoading ? (
          <div className="flex items-center justify-center gap-2 px-gutter py-xl text-label-md text-on-surface-variant">
            <SpinnerIcon />
            Đang tải...
          </div>
        ) : questions.length === 0 ? (
          <p className="px-gutter py-xl text-center text-label-md text-on-surface-variant">
            Không có câu hỏi phù hợp với bộ lọc hiện tại.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant/10">
            {questions.map((question) => {
              const selected = selectedIds.includes(question.id);

              return (
                <li className="flex items-start gap-3 px-4 py-4 transition hover:bg-surface-container-low" key={question.id}>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-label-sm text-on-surface-variant/80">
                        {question.id}
                      </span>
                      <DifficultyBadge difficulty={question.difficulty} />
                      <span className="truncate text-label-sm text-on-surface-variant">
                        {truncateText(question.lesson, 32)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-body-md font-medium text-on-surface">
                      {truncateText(question.question, 120)}
                    </p>
                    <p className="mt-1 line-clamp-1 text-label-sm text-on-surface-variant/60">
                      {question.type}
                    </p>
                  </div>
                  <button
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-label-md font-medium transition ${
                      selected
                        ? "bg-secondary-container text-primary"
                        : "border border-outline-variant/30 bg-white text-primary hover:bg-secondary-container/40"
                    }`}
                    disabled={selected}
                    onClick={() => onAdd(question)}
                    type="button"
                  >
                    <MaterialIcon className="text-[18px]">{selected ? "check" : "add"}</MaterialIcon>
                    {selected ? "Đã chọn" : "Thêm"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {hasActiveFilter ? (
        <footer className="flex shrink-0 items-center justify-between border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-4 text-label-md text-on-surface-variant">
          <span>
            {totalFiltered === 0
              ? "0 câu hỏi"
              : `Hiển thị ${rangeStart} - ${rangeEnd} trong số ${totalFiltered.toLocaleString("vi-VN")} câu hỏi`}
          </span>
          <span>
            {page}/{totalPages}
          </span>
        </footer>
      ) : null}
    </section>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-medium text-primary">
      {difficulty}
    </span>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 animate-spin text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
      />
    </svg>
  );
}
