import type {
  ExportConfig,
  ExportQuestionStatusFilter,
  RandomExamConfig,
} from "../types/export-exam.types";
import type { LessonOptionDto } from "../types/question-library-api.types";

export const DEFAULT_TIME_PER_QUESTION_SECONDS = 30;

export const exportFormatOptions = [{ id: "excel" as const, icon: "table_chart", label: "Excel" }];

export const exportStatusOptions: Array<{
  id: ExportQuestionStatusFilter;
  label: string;
}> = [
  { id: "all", label: "Tất cả trạng thái" },
  { id: "Đã xuất bản", label: "Đã duyệt" },
  { id: "Cần duyệt", label: "Chờ duyệt" },
];

export const exportColumnOptions: {
  id: keyof ExportConfig["columns"];
  label: string;
  defaultChecked: boolean;
  locked?: boolean;
  hint?: string;
}[] = [
  { id: "questionText", label: "Nội dung câu hỏi", defaultChecked: true, locked: true },
  { id: "answerKey", label: "Đáp án", defaultChecked: true, locked: true },
  {
    id: "difficulty",
    label: "Độ khó",
    defaultChecked: false,
    hint: "Không có trong file Wayground",
  },
  { id: "explanation", label: "Giải thích", defaultChecked: false },
];

export const defaultExportConfig: ExportConfig = {
  statusFilter: "all",
  timePerQuestionSeconds: DEFAULT_TIME_PER_QUESTION_SECONDS,
  columns: Object.fromEntries(
    exportColumnOptions.map((column) => [column.id, column.defaultChecked]),
  ) as ExportConfig["columns"],
};

export function createDefaultRandomExamScope(
  lessonOptions: LessonOptionDto[],
): RandomExamConfig["scope"] {
  return {
    subjectTitle: lessonOptions[0]?.subjectTitle ?? "",
    chapterTitles: [],
    lessonIds: [],
  };
}

export const defaultRandomExamConfig: RandomExamConfig = {
  totalCount: 20,
  easyPercent: 50,
  mediumPercent: 30,
  hardPercent: 20,
  scope: {
    subjectTitle: "",
    chapterTitles: [],
    lessonIds: [],
  },
};
