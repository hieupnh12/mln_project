import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type {
  LearningTab,
  StudentFlashcard,
  StudentNavItem,
  StudentTest,
} from "../../types/student.types";

export const studentCourseFeaturedQuote = {
  quote:
    "Triết học không treo lơ lửng ngoài thế giới, cũng như bộ óc không treo lơ lửng ngoài cơ thể con người.",
  author: "Các Mác",
};

export const studentCourseTabs: Array<{ id: LearningTab; label: string }> = [
  { id: "lectures", label: "Bài giảng" },
  { id: "flashcards", label: "Flashcard" },
  { id: "practice", label: "Luyện tập" },
  { id: "exams", label: "Kiểm tra" },
];

export const studentCourseFlashcards: StudentFlashcard[] = [
  {
    front: "Vấn đề cơ bản của triết học là gì?",
    back: "Quan hệ giữa vật chất và ý thức, gồm mặt bản thể luận và nhận thức luận.",
  },
  {
    front: "Chủ nghĩa duy vật biện chứng nhấn mạnh điều gì?",
    back: "Thế giới vật chất tồn tại khách quan và vận động theo các quy luật phổ biến.",
  },
  {
    front: "Vai trò của thực tiễn trong nhận thức?",
    back: "Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn kiểm nghiệm chân lý.",
  },
];

export const studentCourseTests: StudentTest[] = [
  { title: "Kiểm tra nhanh Chương 1", questions: 10, duration: "12 phút" },
  { title: "Luyện tập Chương 2", questions: 15, duration: "18 phút" },
  { title: "Đề tổng hợp giữa kỳ", questions: 30, duration: "45 phút" },
];

export const studentCourseBottomNavItems: StudentNavItem[] = [
  { label: "Trang chủ", icon: "home", href: STUDENT_ROUTES.dashboard },
  { label: "Khóa học", icon: "menu_book", active: true, href: "#" },
  {
    label: "Tiến độ",
    icon: "query_stats",
    href: `${STUDENT_ROUTES.dashboard}#analytics`,
  },
  { label: "Tài khoản", icon: "person", href: STUDENT_ROUTES.dashboard },
];
