export type QuizStatus = "Đã xuất bản" | "Bản nháp" | "Đã tắt";

export type QuizSettings = {
  title: string;
  course: string;
  chapter: string;
  lesson: string;
  duration: number;
  passingScore: number;
  randomCount: number;
  shuffleAnswers: boolean;
  randomQuestions: boolean;
  availableUntil: string;
};

/** Payload nhẹ cho danh sách — không chứa câu hỏi, tối ưu khi gọi API list. */
export type QuizListItem = {
  id: string;
  title: string;
  course: string;
  chapter: string;
  questionCount: number;
  duration: number;
  passingScore: number;
  status: QuizStatus;
  availableUntil?: string;
  updatedAt: string;
  createdAt?: string;
  attemptCount?: number;
};

/** Chi tiết quiz — chỉ load khi mở editor (mock: gắn questionIds). */
export type QuizDetail = QuizListItem & {
  shuffleAnswers: boolean;
  randomQuestions: boolean;
  questionIds: string[];
};

export type QuizFilters = {
  search: string;
  course: string;
  status: "all" | QuizStatus;
};

export type QuizManagementView = "list" | "editor";

export type QuizEditorTab = "settings" | "questions" | "publish";

export type QuizEditorState = {
  quizId: string | null;
  settings: QuizSettings;
  selectedQuestionIds: string[];
  isPublished: boolean;
};
