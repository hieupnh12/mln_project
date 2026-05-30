import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type {
  CourseTone,
  StudentNavItem,
  StudentResource,
} from "../../types/student.types";

export const studentDashboardProfile = {
  name: "Nguyễn Văn A",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAtSLJ6pvntVFxqTwwggWZ63EnliJEEdcMSJ0c9AsvVj5NcLS7Ep5iF2DfQy2_JoWWSrrivYbgTojuIDqmKNCEbcOHRgsc5lgD8tjnTt-NvVrAxsSrkf3mmmUwArIF-PAjqEER0k1rMC8dLSWzJrNkzexAkjAbTx4w0QSVxrpAQtASAjSc_nfqsJ-qx6SFYs6yi603f34X-R5WPFj1fl1_r3xSzKggzTRZaNo3XkD5E_au2M7tg7tDon5NSzoiESZBxX_8hOQXEMetA",
};

export const studentDashboardNavItems: StudentNavItem[] = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Resources", href: "#resources" },
  { label: "Analytics", href: "#analytics" },
];

export const studentDashboardBottomNavItems: StudentNavItem[] = [
  { label: "Home", icon: "home", active: true, href: STUDENT_ROUTES.dashboard },
  { label: "Library", icon: "menu_book", href: `${STUDENT_ROUTES.dashboard}#curriculum` },
  { label: "Progress", icon: "query_stats", href: `${STUDENT_ROUTES.dashboard}#analytics` },
  { label: "Profile", icon: "person", href: `${STUDENT_ROUTES.dashboard}#dashboard` },
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
