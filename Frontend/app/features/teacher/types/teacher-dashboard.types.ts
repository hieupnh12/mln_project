export type TeacherRoutePath =
  | "/teacher"
  | "/teacher/courses"
  | "/teacher/pdfs"
  | "/teacher/mindmaps"
  | "/teacher/flashcards"
  | "/teacher/questions"
  | "/teacher/quizzes";

export type TeacherNavItem = {
  label: string;
  icon: string;
  to: TeacherRoutePath;
};
