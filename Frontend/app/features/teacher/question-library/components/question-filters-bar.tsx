import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import {
  chapterOptions,
  courseOptions,
  defaultQuestionFilters,
  difficultyOptions,
  lessonOptions,
  questionTypeOptions,
} from "../constants/question-library.constants";
import type { Difficulty, QuestionFilters, QuestionType } from "../types/question-library.types";

type QuestionFiltersBarProps = {
  filters: QuestionFilters;
  selectedCount: number;
  canDelete: boolean;
  onChange: (filters: QuestionFilters) => void;
  onReset: () => void;
  onDeleteSelected: () => void;
  onOpenExport: () => void;
  onOpenRandom: () => void;
};

export function QuestionFiltersBar({
  filters,
  selectedCount,
  canDelete,
  onChange,
  onReset,
  onDeleteSelected,
  onOpenExport,
  onOpenRandom,
}: QuestionFiltersBarProps) {
  return (
    <div className="space-y-gutter rounded-lg bg-surface-container-low p-gutter">
      <div className="relative max-w-md">
        <MaterialIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </MaterialIcon>
        <input
          className="w-full rounded-lg border-none bg-white py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary/20"
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Tìm kiếm câu hỏi..."
          type="search"
          value={filters.search}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <FilterSelect
          onChange={(course) => onChange({ ...filters, course })}
          value={filters.course}
        >
          <option value="all">Tất cả Môn học</option>
          {courseOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          onChange={(chapter) => onChange({ ...filters, chapter })}
          value={filters.chapter}
        >
          <option value="all">Chương</option>
          {chapterOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          onChange={(lesson) => onChange({ ...filters, lesson })}
          value={filters.lesson}
        >
          <option value="all">Bài học</option>
          {lessonOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          onChange={(difficulty) =>
            onChange({ ...filters, difficulty: difficulty as Difficulty | "all" })
          }
          value={filters.difficulty}
        >
          <option value="all">Độ khó</option>
          {difficultyOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          onChange={(type) =>
            onChange({ ...filters, type: type as QuestionType | "all" })
          }
          value={filters.type}
        >
          <option value="all">Loại câu hỏi</option>
          {questionTypeOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <div className="flex items-center">
          <button
            className="flex items-center gap-1 text-label-md font-medium text-on-surface-variant transition hover:text-primary"
            onClick={onReset}
            type="button"
          >
            <MaterialIcon className="text-sm">restart_alt</MaterialIcon>
            Làm mới
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/10 pt-4">
        <div className="flex flex-wrap gap-3">
          <OutlineAction icon="download" label="Export" onClick={onOpenExport} />
          <OutlineAction icon="casino" label="Random đề" onClick={onOpenRandom} />
        </div>
        <div className="flex items-center gap-4">
          {selectedCount > 0 ? (
            <span className="rounded-full bg-primary-fixed px-3 py-1 text-label-md font-medium text-primary">
              Đã chọn {selectedCount}
            </span>
          ) : null}
          <button
            className={
              canDelete
                ? "flex items-center gap-2 rounded-lg px-4 py-2 text-label-md font-medium text-error transition hover:bg-error-container/20"
                : "flex cursor-not-allowed items-center gap-2 rounded-lg px-4 py-2 text-label-md font-medium text-on-surface-variant/40"
            }
            disabled={!canDelete}
            onClick={onDeleteSelected}
            type="button"
          >
            <MaterialIcon>delete_sweep</MaterialIcon>
            Xóa nhiều
          </button>
        </div>
      </div>
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
      className="rounded-lg border-outline-variant/30 bg-white p-2 text-label-md font-medium text-on-surface focus:ring-2 focus:ring-primary/20"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
  );
}

function OutlineAction({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex items-center gap-2 rounded-lg border border-outline-variant/50 px-4 py-2 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-variant"
      onClick={onClick}
      type="button"
    >
      <MaterialIcon>{icon}</MaterialIcon>
      {label}
    </button>
  );
}

export function createDefaultFilters(): QuestionFilters {
  return {
    search: defaultQuestionFilters.search,
    course: defaultQuestionFilters.course,
    chapter: defaultQuestionFilters.chapter,
    lesson: defaultQuestionFilters.lesson,
    difficulty: defaultQuestionFilters.difficulty,
    type: defaultQuestionFilters.type,
    status: defaultQuestionFilters.status,
  };
}
