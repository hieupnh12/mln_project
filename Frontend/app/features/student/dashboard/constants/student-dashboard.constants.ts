import { STUDENT_ROUTES } from "../../constants/student-routes.constants";
import type { CourseTone, StudentNavItem } from "../../types/student.types";

export const studentDashboardNavItems: StudentNavItem[] = [
  { label: "Tổng quan", href: "#dashboard" },
  { label: "Chương trình", href: "#curriculum" },
  { label: "Tài liệu", href: "#documents" },
  { label: "Tiến độ", href: "#analytics" },
];

export const studentDashboardBottomNavItems: StudentNavItem[] = [
  {
    label: "Tổng quan",
    icon: "home",
    href: `${STUDENT_ROUTES.dashboard}#dashboard`,
  },
  {
    label: "Khóa học",
    icon: "menu_book",
    href: `${STUDENT_ROUTES.dashboard}#curriculum`,
  },
  {
    label: "Tài liệu",
    icon: "description",
    href: `${STUDENT_ROUTES.dashboard}#documents`,
  },
  {
    label: "Tiến độ",
    icon: "query_stats",
    href: `${STUDENT_ROUTES.dashboard}#analytics`,
  },
];

export const courseToneClass: Record<
  CourseTone,
  {
    action: string;
    badge: string;
    border: string;
    card: string;
    glow: string;
    icon: string;
    progress: string;
  }
> = {
  mint: {
    action: "text-secondary",
    badge: "bg-secondary text-on-secondary shadow-secondary/20",
    border:
      "border-secondary/25 border-t-4 border-t-secondary hover:border-secondary/45 hover:shadow-secondary/15",
    card: "bg-gradient-to-br from-landing-white via-landing-white to-secondary-container/35",
    glow: "bg-secondary-container/60",
    icon: "bg-secondary text-on-secondary shadow-secondary/20",
    progress: "from-secondary to-secondary-fixed-dim",
  },
  warm: {
    action: "text-landing-red",
    badge: "bg-landing-red text-on-primary shadow-landing-red/20",
    border:
      "border-landing-gold/35 border-t-4 border-t-landing-gold hover:border-landing-red/40 hover:shadow-landing-red/15",
    card: "bg-gradient-to-br from-landing-white via-landing-cream to-landing-gold/10",
    glow: "bg-landing-gold/20",
    icon: "bg-landing-red text-on-primary shadow-landing-red/20",
    progress: "from-landing-gold to-landing-red",
  },
};

export const studentDashboardAccentClasses = {
  red: {
    decorative: "bg-landing-red/5",
    icon:
      "border-landing-red/15 bg-landing-red/10 text-landing-red shadow-landing-red/10",
    line: "from-landing-red to-landing-red-deep",
    text: "text-landing-red",
  },
  teal: {
    decorative: "bg-secondary-container/45",
    icon:
      "border-secondary/15 bg-secondary-container/55 text-secondary shadow-secondary/10",
    line: "from-secondary to-secondary-fixed-dim",
    text: "text-secondary",
  },
  gold: {
    decorative: "bg-landing-gold/10",
    icon:
      "border-landing-gold/25 bg-landing-gold/15 text-landing-text-muted shadow-landing-gold/10",
    line: "from-landing-gold to-landing-red/70",
    text: "text-landing-text-muted",
  },
} as const;

export type StudentDashboardAccent = keyof typeof studentDashboardAccentClasses;
