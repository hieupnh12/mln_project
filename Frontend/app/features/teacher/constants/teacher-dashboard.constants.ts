import type { TeacherNavItem } from "../types/teacher-dashboard.types";

export const TEACHER_ROUTES = {
  dashboard: "/teacher",
  courses: "/teacher/courses",
  pdfs: "/teacher/pdfs",
  flashcards: "/teacher/flashcards",
  questions: "/teacher/questions",
  quizzes: "/teacher/quizzes",
} as const;

export const teacherNavItems: TeacherNavItem[] = [
  {
    label: "Dashboard",
    shortLabel: "Trang chủ",
    icon: "dashboard",
    to: TEACHER_ROUTES.dashboard,
  },
  {
    label: "Cấu trúc khóa học",
    shortLabel: "Khóa học",
    icon: "account_tree",
    to: TEACHER_ROUTES.courses,
  },
  {
    label: "Tài liệu PDF",
    shortLabel: "PDF",
    icon: "picture_as_pdf",
    to: TEACHER_ROUTES.pdfs,
  },
  {
    label: "Flashcard",
    shortLabel: "Flashcard",
    icon: "quiz",
    to: TEACHER_ROUTES.flashcards,
  },
  {
    label: "Ngân hàng câu hỏi",
    shortLabel: "Câu hỏi",
    icon: "database",
    to: TEACHER_ROUTES.questions,
  },
  {
    label: "Quản lý Quiz",
    shortLabel: "Quiz",
    icon: "task",
    to: TEACHER_ROUTES.quizzes,
  },
];

export const mindmapNodes = [
  {
    title: "Triết học Mác - Lênin",
    description: "Khung kiến thức trung tâm của học phần.",
    children: ["Vật chất & ý thức", "Phép biện chứng", "Nhận thức luận"],
  },
  {
    title: "Vật chất & ý thức",
    description: "Mối quan hệ nền tảng trong vấn đề cơ bản của triết học.",
    children: ["Tính thứ nhất", "Sự phản ánh", "Vai trò thực tiễn"],
  },
  {
    title: "Phép biện chứng",
    description: "Các nguyên lý, quy luật và cặp phạm trù phổ biến.",
    children: ["Mâu thuẫn", "Lượng - chất", "Phủ định"],
  },
];
