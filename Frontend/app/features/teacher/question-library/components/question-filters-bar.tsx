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
    <div className="space-y-4 rounded-2xl border border-outline-variant/25 bg-landing-gray/25 p-4 md:p-5">
      <div className="w-full">
        <label className="sr-only" htmlFor="question-library-search">
          Tìm kiếm câu hỏi
        </label>
        <div className="relative">
          <MaterialIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-landing-text-soft">
            search
          </MaterialIcon>
          <input
            autoComplete="off"
            className="block min-h-10 w-full rounded-xl border-0 bg-landing-white py-2.5 pl-10 pr-4 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition placeholder:text-landing-text-soft focus:ring-primary/25"
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
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/10 pt-4">
        <div className="flex flex-wrap gap-3">
          <OutlineAction icon="download" label="Export" onClick={onOpenExport} />
          <OutlineAction icon="restart_alt" label="Làm mới" onClick={onReset} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {selectedCount > 0 ? (
            <span className="rounded-full bg-landing-gray px-3 py-1 text-label-md font-medium text-landing-text">
              Đã chọn {selectedCount}
            </span>
          ) : null}
          <button
            className={
              canApprove
                ? "flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-landing-white px-4 py-2 text-label-md font-medium text-landing-text transition hover:bg-landing-gray/60 disabled:cursor-not-allowed disabled:opacity-70"
                : "flex cursor-not-allowed items-center gap-2 rounded-xl px-4 py-2 text-label-md font-medium text-landing-text-soft/50"
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
      className="min-w-0 w-full rounded-xl border-0 bg-landing-white p-2.5 text-label-md font-medium text-landing-text outline-none ring-1 ring-outline-variant/15 transition focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-landing-gray/60 disabled:text-landing-text-soft"
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
      className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-landing-white px-4 py-2 text-label-md font-medium text-landing-text-soft transition hover:bg-landing-gray/60"
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
