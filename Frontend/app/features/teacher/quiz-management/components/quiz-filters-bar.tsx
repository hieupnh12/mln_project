import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import type { QuizFilters } from "../types/quiz-management.types";
import { filterStatusLabel } from "../utils/quiz-ui.helpers";

type QuizFiltersBarProps = {
  courseOptions: string[];
  filters: QuizFilters;
  onChange: (filters: QuizFilters) => void;
  onReset: () => void;
  onSearchChange: (search: string) => void;
  resultCount: number;
  totalCount: number;
};

export function QuizFiltersBar({
  courseOptions,
  filters,
  onChange,
  onReset,
  onSearchChange,
  resultCount,
  totalCount,
}: QuizFiltersBarProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-outline-variant/25 bg-landing-gray/25 p-4 md:p-5">
      <div className="w-full">
        <label className="sr-only" htmlFor="quiz-management-search">
          Tìm kiếm quiz
        </label>
        <div className="relative">
          <MaterialIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-landing-text-soft">
            search
          </MaterialIcon>
          <input
            autoComplete="off"
            className="block min-h-10 w-full rounded-xl border-0 bg-landing-white py-2.5 pl-10 pr-4 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition placeholder:text-landing-text-soft focus:ring-primary/25"
            id="quiz-management-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mã quiz..."
            type="search"
            value={filters.search}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <FilterSelect
          onChange={(course) => onChange({ ...filters, course })}
          value={filters.course}
        >
          <option value="all">Tất cả Môn học</option>
          {courseOptions.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          onChange={(status) =>
            onChange({ ...filters, status: status as QuizFilters["status"] })
          }
          value={filters.status}
        >
          <option value="all">Trạng thái</option>
          <option value="Bản nháp">Bản nháp</option>
          <option value="Đã xuất bản">Đã xuất bản</option>
          <option value="Đã tắt">Đã tắt</option>
        </FilterSelect>
        <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-2">
          <button
            className="flex items-center gap-1 text-label-md font-medium text-landing-text-soft transition hover:text-landing-text"
            onClick={onReset}
            type="button"
          >
            <MaterialIcon className="text-sm">restart_alt</MaterialIcon>
            Làm mới
          </button>
          <span className="text-label-md text-landing-text-soft">
            {resultCount.toLocaleString("vi-VN")} / {totalCount.toLocaleString("vi-VN")} quiz
          </span>
        </div>
      </div>

      {filters.search.trim() || filters.course !== "all" || filters.status !== "all" ? (
        <div className="flex flex-wrap gap-1.5 border-t border-outline-variant/10 pt-4">
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
      ) : null}
    </div>
  );
}

function FilterSelect({
  children,
  onChange,
  value,
}: {
  children: ReactNode;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <select
      className="min-w-0 w-full rounded-xl border-0 bg-landing-white p-2.5 text-label-md font-medium text-landing-text outline-none ring-1 ring-outline-variant/15 transition focus:ring-primary/25"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-landing-gray px-2.5 py-0.5 text-label-sm font-medium text-landing-text">
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

