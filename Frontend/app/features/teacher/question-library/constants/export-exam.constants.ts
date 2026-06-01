import type {
  ChapterTarget,
  ExportColumnId,
  ExportConfig,
  RandomExamConfig,
} from "../types/export-exam.types";

export const exportFormatOptions = [
  { id: "pdf" as const, icon: "picture_as_pdf", label: "PDF" },
  { id: "excel" as const, icon: "table_chart", label: "Excel" },
  { id: "word" as const, icon: "description", label: "Word" },
];

export const exportStatusOptions = [
  { id: "approved" as const, label: "Đã duyệt" },
  { id: "draft" as const, label: "Bản nháp" },
  { id: "archived" as const, label: "Lưu trữ" },
];

export const exportColumnOptions: {
  id: ExportColumnId;
  label: string;
  defaultChecked: boolean;
}[] = [
  { id: "questionText", label: "Nội dung câu hỏi", defaultChecked: true },
  { id: "answerKey", label: "Đáp án", defaultChecked: true },
  { id: "difficulty", label: "Độ khó", defaultChecked: false },
  { id: "lastModified", label: "Cập nhật lần cuối", defaultChecked: false },
];

export const chapterTargetOptions: ChapterTarget[] = [
  {
    id: "Chương 1",
    shortLabel: "CH. 01",
    title: "Vấn đề cơ bản của triết học",
  },
  {
    id: "Chương 2",
    shortLabel: "CH. 02",
    title: "Chủ nghĩa duy vật biện chứng",
  },
  {
    id: "Chương 3",
    shortLabel: "CH. 03",
    title: "Chủ nghĩa duy vật lịch sử",
  },
  {
    id: "Chương 4",
    shortLabel: "CH. 04",
    title: "Phương pháp luận và nhận thức",
  },
];

export const defaultExportConfig: ExportConfig = {
  format: "pdf",
  statusFilter: "approved",
  columns: Object.fromEntries(
    exportColumnOptions.map((col) => [col.id, col.defaultChecked]),
  ) as ExportConfig["columns"],
};

export const defaultRandomExamConfig: RandomExamConfig = {
  totalCount: 50,
  easyPercent: 50,
  mediumPercent: 30,
  hardPercent: 20,
  selectedChapterIds: ["Chương 1", "Chương 3"],
};

export const examPreviewSamples = [
  {
    id: "Q.01",
    difficulty: "Cơ bản",
    chapter: "CH. 01",
    points: 2,
    text: "Vấn đề cơ bản của triết học gồm những mặt nào?",
    accent: "border-secondary",
    labelClass: "text-secondary",
  },
  {
    id: "Q.02",
    difficulty: "Nâng cao",
    chapter: "CH. 03",
    points: 5,
    text: "Phân tích mối quan hệ giữa lực lượng sản xuất và quan hệ sản xuất.",
    accent: "border-primary-container",
    labelClass: "text-primary-container",
  },
  {
    id: "Q.03",
    difficulty: "Vận dụng",
    chapter: "CH. 01",
    points: 3,
    text: "Vai trò của thực tiễn đối với nhận thức là gì?",
    accent: "border-secondary-fixed-dim",
    labelClass: "text-secondary",
  },
] as const;
