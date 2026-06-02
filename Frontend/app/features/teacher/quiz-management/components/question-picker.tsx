import { MaterialIcon } from "../../components/teacher-icons";
import type { QuestionItem, QuestionListItem } from "../../question-library/types/question-library.types";

type QuestionPickerProps = {
  candidateCount: number;
  difficultyFilter: string;
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

export function QuestionPicker({
  candidateCount,
  difficultyFilter,
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

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-white shadow-sm">
      <header className="flex flex-col gap-sm border-b border-outline-variant/10 p-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-headline-md font-semibold text-primary">Ngân hàng phù hợp</h4>
          <p className="text-label-md text-on-surface-variant">
            {candidateCount} câu đã duyệt trong phạm vi · chỉ câu PUBLISHED
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-sm rounded-lg bg-secondary-container px-md py-sm font-semibold text-primary-container disabled:opacity-60"
          disabled={candidateCount === 0}
          onClick={onGenerateRandom}
          type="button"
        >
          Random {Math.min(randomCount, candidateCount)} câu
        </button>
      </header>

      <div className="space-y-sm border-b border-outline-variant/10 p-md">
        <div className="relative">
          <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </MaterialIcon>
          <input
            className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-low py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary/20"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Lọc theo mã, tiêu đề..."
            type="search"
            value={search}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "Cơ bản", "Vận dụng", "Nâng cao"].map((level) => (
            <button
              className={`rounded-full px-3 py-1 text-label-sm font-medium transition ${
                difficultyFilter === level
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:text-primary"
              }`}
              key={level}
              onClick={() => onDifficultyFilterChange(level)}
              type="button"
            >
              {level === "all" ? "Mọi độ khó" : level}
            </button>
          ))}
        </div>
      </div>

      <ul className="max-h-[380px] divide-y divide-outline-variant/10 overflow-y-auto">
        {isLoading ? (
          <li className="p-md text-center text-body-md text-on-surface-variant">Đang tải câu hỏi...</li>
        ) : questions.length === 0 ? (
          <li className="p-md text-center text-body-md text-on-surface-variant">
            Không có câu hỏi phù hợp với bộ lọc hiện tại.
          </li>
        ) : (
          questions.map((question) => {
            const selected = selectedIds.includes(question.id);

            return (
              <li className="flex items-center gap-sm p-md" key={question.id}>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-label-sm text-on-surface-variant">
                      {question.id}
                    </span>
                    <Badge label={question.difficulty} tone="secondary" />
                    <Badge label={question.type} tone="neutral" />
                    <Badge label={question.lesson} tone="neutral" />
                  </div>
                  <p className="truncate font-medium text-primary">{question.title}</p>
                  <p className="line-clamp-1 text-label-md text-on-surface-variant">
                    {question.question}
                  </p>
                </div>
                <button
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-outline-variant/25 bg-white px-3 py-1.5 text-label-md font-semibold text-primary transition hover:bg-secondary-container disabled:opacity-60"
                  disabled={selected}
                  onClick={() => onAdd(question)}
                  type="button"
                >
                  <MaterialIcon>{selected ? "check" : "add"}</MaterialIcon>
                  {selected ? "Đã thêm" : "Thêm"}
                </button>
              </li>
            );
          })
        )}
      </ul>

      <footer className="flex flex-col gap-2 border-t border-outline-variant/10 bg-surface-container-lowest px-md py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label-md text-on-surface-variant">
          {totalFiltered === 0
            ? "Không có kết quả"
            : `Hiển thị ${rangeStart}–${rangeEnd} / ${totalFiltered} câu`}
        </p>
        <p className="text-label-sm text-on-surface-variant">
          Trang {page}/{totalPages}
        </p>
      </footer>
    </section>
  );
}

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "secondary" | "neutral";
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-label-sm ${
        tone === "secondary"
          ? "bg-secondary-container text-primary"
          : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {label}
    </span>
  );
}
