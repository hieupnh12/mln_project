export type QuestionType =
  | "Trắc nghiệm"
  | "Nhiều đáp án"
  | "Đúng/Sai"
  | "Điền khuyết"
  | "Tự luận";

export type Difficulty = "Cơ bản" | "Vận dụng" | "Nâng cao";
export type QuestionStatus = "Bản nháp" | "Cần duyệt" | "Đã xuất bản";
export type QuestionMode = "single" | "batch";

export type QuestionListItem = {
  id: string;
  title: string;
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
  status: QuestionStatus;
  course: string;
  chapter: string;
  lesson: string;
};

export type QuestionListResult = {
  items: QuestionListItem[];
  total: number;
  page: number;
  size: number;
};

export type QuestionItem = QuestionListItem & {
  lessonId?: number;
  answer: string;
  score: number;
  estimatedTime: number;
  tags: string[];
  options: string[];
  correctOptionIndices?: number[];
  explanation?: string;
  updatedBy: string;
};

export type QuestionFilters = {
  search: string;
  course: string;
  chapter: string;
  lesson: string;
  difficulty: Difficulty | "all";
  type: QuestionType | "all";
  status: QuestionStatus | "all";
};

export type QuestionModalId = "add" | "import" | "export";

export type BloomLevel =
  | "Nhận biết"
  | "Hiểu"
  | "Vận dụng"
  | "Phân tích"
  | "Tổng hợp"
  | "Đánh giá";

export type QuestionDraft = Omit<QuestionItem, "id" | "status" | "updatedBy"> & {
  lessonId?: number;
  explanation: string;
  bloomLevel: BloomLevel;
  correctOptionIndex: number;
};
