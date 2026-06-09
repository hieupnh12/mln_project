export type TeacherRoutePath =
  | "/teacher"
  | "/teacher/courses"
  | "/teacher/pdfs"
  | "/teacher/flashcards"
  | "/teacher/questions"
  | "/teacher/quizzes";

export type TeacherNavItem = {
  label: string;
  /** Nhãn ngắn khi sidebar thu gọn hoặc bottom nav mobile. */
  shortLabel: string;
  icon: string;
  to: TeacherRoutePath;
};
