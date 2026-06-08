import { useCallback, useEffect, useState } from "react";

import {
  TEACHER_SIDEBAR_MAIN_OFFSET_CLASS,
  TEACHER_SIDEBAR_STORAGE_KEY,
  TEACHER_SIDEBAR_WIDTH_CLASS,
} from "../constants/teacher-sidebar.constants";

function readCollapsedPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return localStorage.getItem(TEACHER_SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useTeacherSidebar() {
  const [collapsed, setCollapsed] = useState(readCollapsedPreference);

  useEffect(() => {
    try {
      localStorage.setItem(TEACHER_SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch {
      // Bỏ qua khi localStorage không khả dụng.
    }
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  const sidebarWidthClass = collapsed
    ? TEACHER_SIDEBAR_WIDTH_CLASS.collapsed
    : TEACHER_SIDEBAR_WIDTH_CLASS.expanded;

  const mainOffsetClass = collapsed
    ? TEACHER_SIDEBAR_MAIN_OFFSET_CLASS.collapsed
    : TEACHER_SIDEBAR_MAIN_OFFSET_CLASS.expanded;

  return {
    collapsed,
    mainOffsetClass,
    sidebarWidthClass,
    toggleCollapsed,
  };
}
