import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type {
  CourseTone,
  StudentNavItem,
  StudentResource,
} from "../../types/student.types";

export const studentDashboardNavItems: StudentNavItem[] = [
  { label: "Tổng quan", href: "#dashboard" },
  { label: "Chương trình", href: "#curriculum" },
  { label: "Tài nguyên", href: "#resources" },
  { label: "Tiến độ", href: "#analytics" },
];

export const studentDashboardBottomNavItems: StudentNavItem[] = [
  { label: "Trang chủ", icon: "home", active: true, href: STUDENT_ROUTES.dashboard },
  {
    label: "Khóa học",
    icon: "menu_book",
    href: `${STUDENT_ROUTES.dashboard}#curriculum`,
  },
  {
    label: "Tiến độ",
    icon: "query_stats",
    href: `${STUDENT_ROUTES.dashboard}#analytics`,
  },
  {
    label: "Tài khoản",
    icon: "person",
    href: `${STUDENT_ROUTES.dashboard}#dashboard`,
  },
];

export const studentDashboardResources: StudentResource[] = [
  {
    title: "Tóm tắt chương 1",
    type: "PDF",
    icon: "picture_as_pdf",
  },
  {
    title: "Sơ đồ tư duy duy vật biện chứng",
    type: "Mindmap",
    icon: "account_tree",
  },
  {
    title: "Bộ câu hỏi ôn tập giữa kỳ",
    type: "Quiz",
    icon: "quiz",
  },
];

export const courseToneClass: Record<
  CourseTone,
  { card: string; text: string; border: string }
> = {
  mint: {
    card: "bg-landing-white",
    text: "text-landing-red",
    border: "border-landing-red/15",
  },
  warm: {
    card: "bg-landing-cream",
    text: "text-landing-red-dark",
    border: "border-landing-gold/25",
  },
};
