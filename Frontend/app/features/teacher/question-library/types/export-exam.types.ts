export type ExportFormat = "pdf" | "excel" | "word";

export type ExportStatusFilter = "approved" | "draft" | "archived";

export type ExportColumnId =
  | "questionText"
  | "answerKey"
  | "difficulty"
  | "lastModified";

export type ExportConfig = {
  format: ExportFormat;
  statusFilter: ExportStatusFilter;
  columns: Record<ExportColumnId, boolean>;
};

export type RandomExamConfig = {
  totalCount: number;
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
  selectedChapterIds: string[];
};

export type ChapterTarget = {
  id: string;
  shortLabel: string;
  title: string;
};
