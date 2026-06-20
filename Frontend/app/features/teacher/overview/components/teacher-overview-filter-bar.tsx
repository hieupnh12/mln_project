import { MaterialIcon } from "../../components/teacher-icons";
import type { Difficulty, QuestionStatus } from "../../question-library/types/question-library.types";
import {
  TEACHER_OVERVIEW_DIFFICULTY_OPTIONS,
  TEACHER_OVERVIEW_STATUS_OPTIONS,
} from "../constants/teacher-overview.constants";

type TeacherOverviewFilterBarProps = {
  difficulty: Difficulty | "all";
  onDifficultyChange: (value: Difficulty | "all") => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: QuestionStatus | "all") => void;
  search: string;
  status: QuestionStatus | "all";
};

export function TeacherOverviewFilterBar({
  difficulty,
  onDifficultyChange,
  onSearchChange,
  onStatusChange,
  search,
  status,
}: TeacherOverviewFilterBarProps) {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-3">
      <label className="block">
        <span className="text-label-sm font-medium text-landing-text-soft">Tìm kiếm</span>
        <div className="relative mt-1.5">
          <MaterialIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-landing-text-soft">
            filter_alt
          </MaterialIcon>
          <input
            className="w-full rounded-xl border-0 bg-landing-gray/70 py-2.5 pl-10 pr-3 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition placeholder:text-landing-text-soft focus:ring-landing-red/25"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Nhập để lọc..."
            type="search"
            value={search}
          />
        </div>
      </label>

      <label className="block">
        <span className="text-label-sm font-medium text-landing-text-soft">Trạng thái</span>
        <div className="relative mt-1.5">
          <select
            className="w-full appearance-none rounded-xl border-0 bg-landing-gray/70 py-2.5 pl-3 pr-10 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition focus:ring-landing-red/25"
            onChange={(event) => onStatusChange(event.target.value as QuestionStatus | "all")}
            value={status}
          >
            {TEACHER_OVERVIEW_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <MaterialIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-landing-text-soft">
            expand_more
          </MaterialIcon>
        </div>
      </label>

      <label className="block">
        <span className="text-label-sm font-medium text-landing-text-soft">Độ khó</span>
        <div className="relative mt-1.5">
          <select
            className="w-full appearance-none rounded-xl border-0 bg-landing-gray/70 py-2.5 pl-3 pr-10 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition focus:ring-landing-red/25"
            onChange={(event) => onDifficultyChange(event.target.value as Difficulty | "all")}
            value={difficulty}
          >
            {TEACHER_OVERVIEW_DIFFICULTY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <MaterialIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-landing-text-soft">
            expand_more
          </MaterialIcon>
        </div>
      </label>
    </section>
  );
}
