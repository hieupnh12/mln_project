import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type {
  CourseTone,
  StudentNavItem,
  StudentResource,
} from "../../types/student.types";

export const studentDashboardNavItems: StudentNavItem[] = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Resources", href: "#resources" },
  { label: "Analytics", href: "#analytics" },
];

export const studentDashboardBottomNavItems: StudentNavItem[] = [
  { label: "Home", icon: "home", active: true, href: STUDENT_ROUTES.dashboard },
  {
    label: "Library",
    icon: "menu_book",
    href: `${STUDENT_ROUTES.dashboard}#curriculum`,
  },
  {
    label: "Progress",
    icon: "query_stats",
    href: `${STUDENT_ROUTES.dashboard}#analytics`,
  },
  {
    label: "Profile",
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
    card: "bg-secondary-container",
    text: "text-secondary",
    border: "border-secondary-container/60",
  },
  warm: {
    card: "bg-tertiary-fixed",
    text: "text-on-surface-variant",
    border: "border-tertiary-fixed/60",
  },
};
