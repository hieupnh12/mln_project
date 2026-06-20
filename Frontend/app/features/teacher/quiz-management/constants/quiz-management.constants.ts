import type { QuizFilters } from "../types/quiz-management.types";

export const QUIZ_MANAGEMENT_ENDPOINTS = {
  root: "/teacher/quizzes",
  stats: "/teacher/quizzes/stats",
  candidateQuestions: "/teacher/quizzes/candidate-questions",
  importExam: "/teacher/quizzes/import-exam",
  byId: (id: string) => `/teacher/quizzes/${encodeURIComponent(id)}`,
  publish: (id: string) => `/teacher/quizzes/${encodeURIComponent(id)}/publish`,
  duplicate: (id: string) => `/teacher/quizzes/${encodeURIComponent(id)}/duplicate`,
  close: (id: string) => `/teacher/quizzes/${encodeURIComponent(id)}/close`,
} as const;

export const QUIZ_MANAGEMENT_QUERY_KEYS = {
  root: ["teacher", "quiz-management"] as const,
  list: (filters: QuizFilters) => ["teacher", "quiz-management", "list", filters] as const,
  stats: ["teacher", "quiz-management", "stats"] as const,
  detail: (id: string) => ["teacher", "quiz-management", "detail", id] as const,
  candidates: (
    scope: { course: string; chapter: string; lesson: string; search: string; difficulty: string },
    page: number,
    size: number,
  ) => ["teacher", "quiz-management", "candidates", scope, page, size] as const,
};

/** Số câu mỗi trang khi đã tìm kiếm hoặc lọc độ khó. */
export const QUIZ_CANDIDATE_PAGE_SIZE = 6;

/** Lưu/xuất bản quiz có thể mất lâu khi gắn nhiều câu hỏi. */
export const QUIZ_SAVE_TIMEOUT_MS = 120_000;

/** Chi tiết quiz gồm toàn bộ câu hỏi, đáp án và tag nên cần timeout riêng. */
export const QUIZ_DETAIL_TIMEOUT_MS = 120_000;

/** Import đề Excel → quiz có thể mất rất lâu với file lớn. */
export const QUIZ_EXAM_IMPORT_TIMEOUT_MS = 600_000;

export const defaultQuizFilters: QuizFilters = {
  search: "",
  course: "all",
  status: "all",
};

export const defaultQuizSettings = {
  title: "Quiz mới",
  course: "",
  chapter: "all",
  lesson: "all",
  duration: 20,
  passingScore: 70,
  randomCount: 10,
  shuffleAnswers: true,
  randomQuestions: false,
  availableUntil: "",
};

export const quizEditorTabLabels = {
  settings: "Cài đặt",
  questions: "Câu hỏi",
  publish: "Xuất bản",
} as const;

export const quizEditorTabDescriptions = {
  settings: "Tên & phạm vi",
  questions: "Chọn câu",
  publish: "Kiểm tra & publish",
} as const;
