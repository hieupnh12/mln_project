export const TEACHER_PORTAL_SOFT_SHADOW =
  "shadow-[0_24px_60px_rgb(17,24,39,0.08)]";

export const TEACHER_PORTAL_ROW_SHADOW =
  "shadow-[0_4px_20px_rgb(17,24,39,0.05)]";

export const TEACHER_MODAL_SHELL =
  "overflow-hidden rounded-2xl border border-outline-variant/25 bg-landing-white shadow-[0_24px_60px_rgb(17,24,39,0.12)]";

export const TEACHER_MODAL_BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-landing-red px-5 py-2.5 text-label-md font-semibold text-on-primary shadow-md shadow-landing-red/20 transition hover:bg-landing-red-deep disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

export const TEACHER_MODAL_BTN_SECONDARY =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/40 bg-landing-white px-5 py-2.5 text-label-md font-semibold text-landing-text transition hover:bg-landing-gray/60 disabled:cursor-not-allowed disabled:opacity-60";

export const TEACHER_MODAL_PANEL =
  "rounded-2xl border border-outline-variant/25 bg-landing-gray/25 p-4 md:p-5";

export const TEACHER_MODAL_FIELD =
  "w-full rounded-xl border-0 bg-landing-white p-3 text-body-md text-landing-text outline-none ring-1 ring-outline-variant/15 transition placeholder:text-landing-text-soft focus:ring-primary/25";

export const TEACHER_QUESTION_STATUS_BADGE = {
  "Bản nháp": "bg-landing-gray text-landing-text-muted",
  "Cần duyệt": "bg-catalog-cobalt/10 text-catalog-cobalt",
  "Đã xuất bản": "bg-catalog-indigo/10 text-catalog-indigo",
} as const;

export const TEACHER_QUESTION_DIFFICULTY_BADGE = {
  "Cơ bản": "bg-landing-gray text-landing-text-soft",
  "Vận dụng": "bg-catalog-cyan/10 text-catalog-cobalt",
  "Nâng cao": "bg-primary-container/15 text-primary",
} as const;

export const TEACHER_QUIZ_STATUS_BADGE = {
  "Bản nháp": "bg-landing-gray text-landing-text-soft",
  "Đã xuất bản": "bg-catalog-indigo/10 text-catalog-indigo",
  "Đã tắt": "bg-landing-gray text-landing-text-muted",
} as const;

export const teacherDashboardAccentClasses = {
  red: {
    decorative: "bg-landing-red/5",
    icon:
      "border-landing-red/15 bg-landing-red/10 text-landing-red shadow-landing-red/10",
    line: "from-landing-red to-landing-red-deep",
    text: "text-landing-red",
  },
  gold: {
    decorative: "bg-landing-gold/10",
    icon:
      "border-landing-gold/25 bg-landing-gold/15 text-landing-text-muted shadow-landing-gold/10",
    line: "from-landing-gold to-landing-red/70",
    text: "text-landing-text-muted",
  },
  teal: {
    decorative: "bg-secondary-container/45",
    icon:
      "border-secondary/15 bg-secondary-container/55 text-secondary shadow-secondary/10",
    line: "from-secondary to-secondary-fixed-dim",
    text: "text-secondary",
  },
  navy: {
    decorative: "bg-primary-container/10",
    icon:
      "border-primary-container/20 bg-primary-container/15 text-primary shadow-landing-text/10",
    line: "from-primary-container to-primary",
    text: "text-primary",
  },
} as const;

export type TeacherDashboardAccent = keyof typeof teacherDashboardAccentClasses;

export const TEACHER_DASHBOARD_METRIC_ACCENTS: TeacherDashboardAccent[] = [
  "red",
  "gold",
  "navy",
  "red",
];

export function getTeacherDashboardMetricAccent(index: number): TeacherDashboardAccent {
  return TEACHER_DASHBOARD_METRIC_ACCENTS[index % TEACHER_DASHBOARD_METRIC_ACCENTS.length] ?? "red";
}
