export type ImportPreviewRow = {
  id: string;
  content: string;
  type: string;
  typeLabel: string;
  difficulty: string;
  tags: string;
  subject?: string;
  chapter?: string;
  lesson?: string;
  lessonId?: number;
  lessonLabel?: string;
  lessonError?: string;
  options?: string[];
  answer?: string;
  explanation?: string;
};

export type ImportTargetStatus = "PENDING" | "PUBLISHED";

export type ImportFieldMapping = {
  id: string;
  systemField: string;
  systemLabel: string;
  excelColumn: string | null;
  matched: boolean;
};

export type ImportBatchStep = "upload" | "review";
