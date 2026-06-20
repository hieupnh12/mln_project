import { TEACHER_ROUTES } from "../../constants/teacher-dashboard.constants";
import type { Difficulty, QuestionStatus } from "../../question-library/types/question-library.types";

export const TEACHER_OVERVIEW_PAGE_SIZE = 5;

export const TEACHER_OVERVIEW_SOFT_SHADOW =
  "shadow-[0_24px_60px_rgb(17,24,39,0.08)]";

export const TEACHER_OVERVIEW_ROW_SHADOW =
  "shadow-[0_4px_20px_rgb(17,24,39,0.05)]";

export type TeacherSummaryIconStyle = {
  square: string;
};

export const TEACHER_SUMMARY_ICON_STYLES: TeacherSummaryIconStyle[] = [
  { square: "bg-landing-red/12 text-landing-red" },
  { square: "bg-landing-gold/15 text-landing-text-muted" },
  { square: "bg-secondary-container/80 text-secondary" },
  { square: "bg-primary-container/20 text-primary" },
];

export type TeacherOverviewModuleConfig = {
  icon: string;
  iconStyle: TeacherSummaryIconStyle;
  label: string;
  moduleKey: "courses" | "flashcards" | "questions" | "quizzes";
  to: string;
};

export const TEACHER_OVERVIEW_MODULES: TeacherOverviewModuleConfig[] = [
  {
    moduleKey: "courses",
    icon: "account_tree",
    iconStyle: TEACHER_SUMMARY_ICON_STYLES[0]!,
    label: "Khóa học",
    to: TEACHER_ROUTES.courses,
  },
  {
    moduleKey: "questions",
    icon: "database",
    iconStyle: TEACHER_SUMMARY_ICON_STYLES[1]!,
    label: "Câu hỏi",
    to: TEACHER_ROUTES.questions,
  },
  {
    moduleKey: "flashcards",
    icon: "style",
    iconStyle: TEACHER_SUMMARY_ICON_STYLES[2]!,
    label: "Flashcard",
    to: TEACHER_ROUTES.flashcards,
  },
  {
    moduleKey: "quizzes",
    icon: "task",
    iconStyle: TEACHER_SUMMARY_ICON_STYLES[3]!,
    label: "Quiz",
    to: TEACHER_ROUTES.quizzes,
  },
];

export const TEACHER_OVERVIEW_STATUS_OPTIONS: ReadonlyArray<{
  label: string;
  value: QuestionStatus | "all";
}> = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "Đã xuất bản", label: "Đã duyệt" },
  { value: "Cần duyệt", label: "Cần duyệt" },
  { value: "Bản nháp", label: "Bản nháp" },
];

export const TEACHER_OVERVIEW_DIFFICULTY_OPTIONS: ReadonlyArray<{
  label: string;
  value: Difficulty | "all";
}> = [
  { value: "all", label: "Tất cả độ khó" },
  { value: "Cơ bản", label: "Cơ bản" },
  { value: "Vận dụng", label: "Vận dụng" },
  { value: "Nâng cao", label: "Nâng cao" },
];

export const TEACHER_QUESTION_STATUS_BADGE: Record<QuestionStatus, string> = {
  "Bản nháp": "bg-landing-gray text-landing-text-muted",
  "Cần duyệt": "bg-landing-red/10 text-landing-red",
  "Đã xuất bản": "bg-landing-red/5 text-landing-red-deep",
};

export const TEACHER_QUESTION_DIFFICULTY_BADGE: Record<Difficulty, string> = {
  "Cơ bản": "bg-landing-red/8 text-landing-red",
  "Vận dụng": "bg-landing-gold/15 text-landing-text-muted",
  "Nâng cao": "bg-primary-container/15 text-primary",
};
