import type { TeacherNavItem } from "../types/teacher-dashboard.types";

export const teacherProfile = {
  name: "Giảng viên Nguyen",
  plan: "Premium Account",
  course: "Triết học Mác - Lênin",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCTFytM8KmPcZ84-Wke_b1yd7MqgYKPlE9YURylBtsU3O04MZ0TGkMLaQiTcWcMVK99JVZdVOtRIr6fKqKFh8k3rmjrQW2nFSfx6AN64uPU_v8Qed1k1Sw4t1S2KyrqrpmQTLlc4DrfKsHHMUlbDR8pi22RYTnatW9rg86ig8kQCCaXmT3jw6Lcvz06AzIv47VK4za9GreHA8PzXW7d8gVBdEd81elfDL-mAlx_7s-Jh370s8l7GK2kWt7o2hq2fPTaIny4tRpGIHL7",
};

export const TEACHER_ROUTES = {
  dashboard: "/teacher",
  courses: "/teacher/courses",
  pdfs: "/teacher/pdfs",
  mindmaps: "/teacher/mindmaps",
  flashcards: "/teacher/flashcards",
  questions: "/teacher/questions",
  quizzes: "/teacher/quizzes",
} as const;

export const teacherNavItems: TeacherNavItem[] = [
  { label: "Dashboard", icon: "dashboard", to: TEACHER_ROUTES.dashboard },
  {
    label: "Cấu trúc khóa học",
    icon: "account_tree",
    to: TEACHER_ROUTES.courses,
  },
  { label: "Tài liệu PDF", icon: "picture_as_pdf", to: TEACHER_ROUTES.pdfs },
  { label: "Mindmap", icon: "hub", to: TEACHER_ROUTES.mindmaps },
  { label: "Flashcard", icon: "quiz", to: TEACHER_ROUTES.flashcards },
  {
    label: "Ngân hàng câu hỏi",
    icon: "database",
    to: TEACHER_ROUTES.questions,
  },
  { label: "Quản lý Quiz", icon: "task", to: TEACHER_ROUTES.quizzes },
];
