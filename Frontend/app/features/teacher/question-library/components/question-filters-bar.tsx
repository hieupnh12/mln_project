import type { ReactNode } from "react";

import { MaterialIcon } from "../../components/teacher-icons";
import {
  defaultQuestionFilters,
  difficultyOptions,
  questionStatusOptions,
  questionTypeOptions,
  statusDisplayLabels,
} from "../constants/question-library.constants";
import type { Difficulty, QuestionFilters, QuestionStatus, QuestionType } from "../types/question-library.types";

type QuestionFiltersBarProps = {
  filters: QuestionFilters;
  selectedCount: number;
  canApprove: boolean;
  approvingSelected: boolean;
  canDelete: boolean;
  deletingSelected: boolean;
  canSelectChapter: boolean;
  canSelectLesson: boolean;
  courseOptions: string[];
  chapterOptions: string[];
  lessonOptions: string[];
  onChange: (filters: QuestionFilters) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  onApproveSelected: () => void;
  onDeleteSelected: () => void;
  onOpenExport: () => void;
};

export function QuestionFiltersBar({
  filters,
  selectedCount,
  canApprove,
  approvingSelected,
  canDelete,
  deletingSelected,
  canSelectChapter,
  canSelectLesson,
  courseOptions,
  chapterOptions,
  lessonOptions,
  onChange,
  onSearchChange,
  onReset,
  onApproveSelected,
  onDeleteSelected,
  onOpenExport,
}: QuestionFiltersBarProps) {
  return (
    <div className="space-y-gutter rounded-lg bg-surface-container-low p-gutter">
      <div className="w-full">
        <label className="sr-only" htmlFor="question-library-search">
          Tìm kiếm câu hỏi
        </label>
        <div className="relative">
          <MaterialIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </MaterialIcon>
          <input
            autoComplete="off"
            className="block min-h-10 w-full rounded-lg border border-outline-variant/20 bg-white py-2 pl-10 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
            id="question-library-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm theo nội dung, tiêu đề hoặc mã Q-..."
            type="search"
            value={filters.search}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-7">
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
          disabled={!canSelectChapter}
          onChange={(chapter) => onChange({ ...filters, chapter })}
          value={filters.chapter}
        >
          <option value="all">
            {canSelectChapter ? "Chương" : "Chọn môn trước"}
          </option>
          {chapterOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          disabled={!canSelectLesson}
          onChange={(lesson) => onChange({ ...filters, lesson })}
          value={filters.lesson}
        >
          <option value="all">
            {canSelectLesson ? "Bài học" : "Chọn chương trước"}
          </option>
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
        <FilterSelect
          onChange={(status) =>
            onChange({ ...filters, status: status as QuestionStatus | "all" })
          }
          value={filters.status}
        >
          <option value="all">Trạng thái</option>
          {questionStatusOptions.map((item) => (
            <option key={item} value={item}>
              {statusDisplayLabels[item]}
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
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {selectedCount > 0 ? (
            <span className="rounded-full bg-primary-fixed px-3 py-1 text-label-md font-medium text-primary">
              Đã chọn {selectedCount}
            </span>
          ) : null}
          <button
            className={
              canApprove
                ? "flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2 text-label-md font-medium text-primary transition hover:bg-secondary-fixed disabled:cursor-not-allowed disabled:opacity-70"
                : "flex cursor-not-allowed items-center gap-2 rounded-lg px-4 py-2 text-label-md font-medium text-on-surface-variant/40"
            }
            disabled={!canApprove || approvingSelected}
            onClick={onApproveSelected}
            type="button"
          >
            <MaterialIcon>{approvingSelected ? "sync" : "done_all"}</MaterialIcon>
            {approvingSelected ? "Đang duyệt..." : "Duyệt đã chọn"}
          </button>
          <button
            className={
              canDelete
                ? "flex items-center gap-2 rounded-lg px-4 py-2 text-label-md font-medium text-error transition hover:bg-error-container/20 disabled:cursor-not-allowed disabled:opacity-60"
                : "flex cursor-not-allowed items-center gap-2 rounded-lg px-4 py-2 text-label-md font-medium text-on-surface-variant/40"
            }
            disabled={!canDelete || deletingSelected}
            onClick={onDeleteSelected}
            type="button"
          >
            <MaterialIcon>{deletingSelected ? "sync" : "delete_sweep"}</MaterialIcon>
            {deletingSelected ? "Đang xóa..." : "Xóa nhiều"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  children,
  disabled = false,
  onChange,
  value,
}: {
  children: ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <select
      className="min-w-0 w-full rounded-lg border-outline-variant/30 bg-white p-2 text-label-md font-medium text-on-surface focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-on-surface-variant/60"
      disabled={disabled}
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
