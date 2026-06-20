import { useCallback, useEffect, useState } from "react";

import { COURSE_SIDEBAR_STORAGE_KEY } from "../constants/course-tab-config";

function readCollapsedPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(COURSE_SIDEBAR_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function useCourseSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(readCollapsedPreference);

  useEffect(() => {
    try {
      window.localStorage.setItem(COURSE_SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // Ignore storage errors.
    }
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  return { collapsed, toggleCollapsed, setCollapsed };
}
