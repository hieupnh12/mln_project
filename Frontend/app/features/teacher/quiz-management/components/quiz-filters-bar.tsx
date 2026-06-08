import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizFilters } from "../types/quiz-management.types";
import { filterStatusLabel } from "../utils/quiz-ui.helpers";

type QuizFiltersBarProps = {
  courseOptions: string[];
  filters: QuizFilters;
  onChange: (filters: QuizFilters) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
};

export function QuizFiltersBar({
  courseOptions,
  filters,
  onChange,
  onReset,
  resultCount,
  totalCount,
}: QuizFiltersBarProps) {
  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.course !== "all" ||
    filters.status !== "all";

  return (
    <div className="shrink-0 rounded-lg border border-outline-variant/20 bg-white px-sm py-2 shadow-sm">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <MaterialIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </MaterialIcon>
          <input
            className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-low/50 py-1.5 pl-9 pr-3 text-label-md focus:ring-2 focus:ring-secondary/15"
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Tìm theo tên hoặc mã quiz..."
            type="search"
            value={filters.search}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Lọc theo môn"
            className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 px-2.5 py-1.5 text-label-md"
            onChange={(event) => onChange({ ...filters, course: event.target.value })}
            value={filters.course}
          >
            <option value="all">Tất cả môn</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          <select
            aria-label="Lọc theo trạng thái"
            className="rounded-lg border border-outline-variant/20 bg-surface-container-low/50 px-2.5 py-1.5 text-label-md"
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as QuizFilters["status"],
              })
            }
            value={filters.status}
          >
            <option value="all">Mọi trạng thái</option>
            <option value="Bản nháp">Bản nháp</option>
            <option value="Đã xuất bản">Đã xuất bản</option>
          </select>
          <button
            className="rounded-lg border border-outline-variant/30 bg-white px-3 py-1.5 text-label-sm font-medium text-primary transition hover:bg-surface-container-low disabled:opacity-50"
            disabled={!hasActiveFilters}
            onClick={onReset}
            type="button"
          >
            Đặt lại
          </button>
          <span className="text-label-sm text-on-surface-variant">
            {resultCount}/{totalCount}
          </span>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {filters.search.trim() ? (
            <FilterChip
              label={`"${filters.search.trim()}"`}
              onRemove={() => onChange({ ...filters, search: "" })}
            />
          ) : null}
          {filters.course !== "all" ? (
            <FilterChip
              label={filters.course}
              onRemove={() => onChange({ ...filters, course: "all" })}
            />
          ) : null}
          {filters.status !== "all" ? (
            <FilterChip
              label={filterStatusLabel(filters.status)}
              onRemove={() => onChange({ ...filters, status: "all" })}
            />
          ) : null}
        </div>
      ) : (
        <p className="mt-1.5 text-label-sm text-on-surface-variant">
          Danh sách chỉ tải metadata — mở editor mới load chi tiết câu hỏi.
        </p>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container/40 px-2 py-0.5 text-label-sm text-primary">
      {label}
      <button
        aria-label={`Bỏ lọc ${label}`}
        className="rounded-full p-0.5 hover:bg-white/60"
        onClick={onRemove}
        type="button"
      >
        <MaterialIcon className="text-[14px]">close</MaterialIcon>
      </button>
    </span>
  );
}
