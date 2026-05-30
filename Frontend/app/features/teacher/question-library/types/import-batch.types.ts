export type ImportPreviewRow = {
  id: string;
  content: string;
  type: string;
  typeLabel: string;
  difficulty: string;
  tags: string;
};

export type ImportFieldMapping = {
  id: string;
  systemLabel: string;
  selectedColumn: string;
  options: string[];
};

export type ImportBatchStep = "upload" | "review";
