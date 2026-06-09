import type { Difficulty } from "./question-library.types";
import type { QuestionStatus } from "./question-library.types";

export type ExportColumnId = "questionText" | "answerKey" | "difficulty" | "explanation";

export type ExportQuestionStatusFilter = "all" | Extract<QuestionStatus, "Cần duyệt" | "Đã xuất bản">;

export type ExportConfig = {
  statusFilter: ExportQuestionStatusFilter;
  timePerQuestionSeconds: number;
  columns: Record<ExportColumnId, boolean>;
};

export type RandomExamScope = {
  subjectTitle: string;
  chapterTitles: string[];
  lessonIds: number[];
};

export type RandomExamConfig = {
  totalCount: number;
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
  scope: RandomExamScope;
};

export type RandomExamValidation = {
  valid: boolean;
  poolSize: number;
  byDifficulty: Record<Difficulty, number>;
  requiredByDifficulty: Record<Difficulty, number>;
  errors: string[];
};

export type WaygroundExportOptions = {
  includeExplanation: boolean;
  timePerQuestionSeconds: number;
};

export function toWaygroundExportOptions(config: ExportConfig): WaygroundExportOptions {
  return {
    includeExplanation: config.columns.explanation,
    timePerQuestionSeconds: config.timePerQuestionSeconds,
  };
}
