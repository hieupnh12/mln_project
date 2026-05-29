import { SelectInput, TextInput } from "../../components/teacher-form-controls";
import { MaterialIcon } from "../../components/teacher-icons";
import {
  chapterOptions,
  courseOptions,
  difficultyOptions,
  lessonOptions,
  questionStatusOptions,
} from "../constants/question-library.constants";
import type {
  Difficulty,
  QuestionFilters,
  QuestionStatus,
} from "../types/question-library.types";

type QuestionFilterPanelProps = {
  filters: QuestionFilters;
  onChange: (filters: QuestionFilters) => void;
};

export function QuestionFilterPanel({
  filters,
  onChange,
}: QuestionFilterPanelProps) {
  return (
    <aside className="space-y-md rounded-2xl border border-outline-variant/20 bg-white p-md shadow-[0_4px_20px_rgba(35,39,51,0.04)]">
      <h4 className="flex items-center gap-sm text-headline-md font-semibold text-primary">
        <MaterialIcon>filter_alt</MaterialIcon>
        Bộ lọc
      </h4>
      <TextInput
        label="Tìm kiếm"
        onChange={(search) => onChange({ ...filters, search })}
        value={filters.search}
      />
      <SelectInput
        label="Môn"
        onChange={(course) => onChange({ ...filters, course })}
        value={filters.course}
      >
        <option value="all">Tất cả môn</option>
        {courseOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <SelectInput
        label="Chương"
        onChange={(chapter) => onChange({ ...filters, chapter })}
        value={filters.chapter}
      >
        <option value="all">Tất cả chương</option>
        {chapterOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <SelectInput
        label="Bài"
        onChange={(lesson) => onChange({ ...filters, lesson })}
        value={filters.lesson}
      >
        <option value="all">Tất cả bài</option>
        {lessonOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <SelectInput
        label="Độ khó"
        onChange={(difficulty) =>
          onChange({ ...filters, difficulty: difficulty as Difficulty | "all" })
        }
        value={filters.difficulty}
      >
        <option value="all">Tất cả độ khó</option>
        {difficultyOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
      <SelectInput
        label="Trạng thái"
        onChange={(status) =>
          onChange({ ...filters, status: status as QuestionStatus | "all" })
        }
        value={filters.status}
      >
        <option value="all">Tất cả trạng thái</option>
        {questionStatusOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </SelectInput>
    </aside>
  );
}
