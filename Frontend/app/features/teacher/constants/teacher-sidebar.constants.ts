export const TEACHER_SIDEBAR_STORAGE_KEY = "teacher-sidebar-collapsed";

/** Chiều rộng sidebar mở rộng (w-64) và thu gọn kiểu Canva. */
export const TEACHER_SIDEBAR_WIDTH_CLASS = {
  expanded: "w-64",
  collapsed: "w-[4.5rem]",
} as const;

export const TEACHER_SIDEBAR_MAIN_OFFSET_CLASS = {
  expanded: "lg:ml-64",
  collapsed: "lg:ml-[4.5rem]",
} as const;
