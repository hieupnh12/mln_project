import type { QuizFilters } from "../types/quiz-management.types";

export const QUIZ_MANAGEMENT_ENDPOINTS = {
  root: "/teacher/quizzes",
  stats: "/teacher/quizzes/stats",
  candidateQuestions: "/teacher/quizzes/candidate-questions",
  byId: (id: string) => `/teacher/quizzes/${encodeURIComponent(id)}`,
  publish: (id: string) => `/teacher/quizzes/${encodeURIComponent(id)}/publish`,
  duplicate: (id: string) => `/teacher/quizzes/${encodeURIComponent(id)}/duplicate`,
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

export const QUIZ_CANDIDATE_PAGE_SIZE = 8;

export const defaultQuizFilters: QuizFilters = {
  search: "",
  course: "all",
  status: "all",
};

export const defaultQuizSettings = {
  title: "Quiz mới",
  course: "",
  chapter: "",
  lesson: "all",
  duration: 20,
  passingScore: 70,
  randomCount: 10,
  shuffleAnswers: true,
  randomQuestions: false,
};

export const quizEditorTabLabels = {
  settings: "Cài đặt",
  questions: "Câu hỏi",
  publish: "Xuất bản",
} as const;

export const quizEditorTabDescriptions = {
  settings: "Tên, phạm vi môn/chương và quy tắc làm bài",
  questions: "Chọn hoặc random câu từ ngân hàng đã duyệt",
  publish: "Kiểm tra checklist và xuất bản cho sinh viên",
} as const;
