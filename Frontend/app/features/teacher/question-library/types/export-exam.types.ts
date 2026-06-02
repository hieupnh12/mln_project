import type { Difficulty } from "./question-library.types";

export type ExportColumnId = "questionText" | "answerKey" | "difficulty" | "explanation";

export type ExportConfig = {
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

export type RandomExamPreviewItem = {
  id: string;
  question: string;
  difficulty: Difficulty;
  chapter: string;
  lesson: string;
  score: number;
  timeInSeconds: number;
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
